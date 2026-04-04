import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckinService } from '../../core/services/checkin.service';
import { Guest } from '../../core/models/api.models';

@Component({
  selector: 'app-checkin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkin.page.html'
})
export class CheckinPage {
  private readonly checkinService = inject(CheckinService);

  uid = '';
  remarks = '';
  result: Guest | null = null;
  error = '';

  submit(): void {
    this.error = '';
    this.result = null;

    this.checkinService.checkIn({ uid: this.uid, remarks: this.remarks || undefined }).subscribe({
      next: (guest) => {
        this.result = guest;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Erreur de check-in';
      }
    });
  }
}
