import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckinService } from '../../core/services/checkin.service';
import { Guest } from '../../core/models/api.models';

@Component({
  selector: 'app-scan-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scan.page.html'
})
export class ScanPage implements OnDestroy {
  private readonly checkinService = inject(CheckinService);

  videoStream: MediaStream | null = null;
  scanInterval: ReturnType<typeof setInterval> | null = null;
  isScanning = false;
  isSubmitting = false;
  scanMessage = '';
  error = '';
  result: Guest | null = null;
  manualLink = '';

  async startScan(videoElement: HTMLVideoElement): Promise<void> {
    this.error = '';
    this.scanMessage = '';

    const detectorCtor = (window as { BarcodeDetector?: new (...args: unknown[]) => { detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector;
    if (!detectorCtor) {
      this.error = 'Le scan caméra n’est pas supporté sur ce navigateur. Utilisez la saisie manuelle du lien QR.';
      return;
    }

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoElement.srcObject = this.videoStream;
      await videoElement.play();

      const detector = new detectorCtor({ formats: ['qr_code'] as unknown as never[] });
      this.isScanning = true;
      this.scanMessage = 'Scan en cours...';

      this.scanInterval = setInterval(async () => {
        if (!this.isScanning) return;

        const detections = await detector.detect(videoElement);
        const value = detections?.[0]?.rawValue;
        if (value) {
          this.scanMessage = `QR détecté: ${value}`;
          this.stopScan();
          this.handleQrValue(value);
        }
      }, 500);
    } catch {
      this.error = 'Impossible d’accéder à la caméra.';
      this.stopScan();
    }
  }

  stopScan(): void {
    this.isScanning = false;

    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }

    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = null;
    }
  }

  submitManualLink(): void {
    this.error = '';
    this.scanMessage = '';

    if (!this.manualLink.trim()) {
      this.error = 'Merci de coller un lien QR valide.';
      return;
    }

    this.handleQrValue(this.manualLink.trim());
  }

  private extractUid(value: string): string | null {
    try {
      const url = new URL(value);
      const queryUid = url.searchParams.get('uid');
      if (queryUid) return queryUid;

      const segments = url.pathname.split('/').filter(Boolean);
      return segments.at(-1) ?? null;
    } catch {
      return value.trim() || null;
    }
  }

  private handleQrValue(value: string): void {
    const uid = this.extractUid(value);
    if (!uid) {
      this.error = 'UID introuvable dans le QR code.';
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.error = '';
    this.result = null;

    this.checkinService.checkIn({ uid }).subscribe({
      next: (guest) => {
        this.isSubmitting = false;
        this.result = guest;
        this.scanMessage = `Check-in validé pour ${guest.name}.`;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err?.error?.message ?? 'Échec du check-in depuis le scan.';
      }
    });
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
