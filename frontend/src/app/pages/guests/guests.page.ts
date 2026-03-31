import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestsService } from '../../core/services/guests.service';
import { Guest, GuestType } from '../../core/models/api.models';

@Component({
  selector: 'app-guests-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guests.page.html'
})
export class GuestsPage implements OnInit {
  private readonly guestsService = inject(GuestsService);

  guests: Guest[] = [];
  types: GuestType[] = ['Homme', 'Femme', 'Famille', 'Groupe'];
  error = '';
  editingId: number | null = null;
  importCeremonyId = 1;
  selectedFile: File | null = null;
  isSaving = false;
  isImporting = false;

  form = {
    name: '',
    type: 'Famille' as GuestType,
    seatCount: 1,
    ceremonyId: 1,
    remarks: ''
  };

  ngOnInit(): void {
    this.loadGuests();
  }

  private validateGuestForm(): string | null {
    if (!this.form.name.trim()) return 'Le nom de l’invité est obligatoire.';
    if (!this.form.type) return 'Le type est obligatoire.';
    if (!Number.isFinite(this.form.seatCount) || this.form.seatCount < 1) {
      return 'Le nombre de places doit être supérieur à 0.';
    }
    if (!Number.isFinite(this.form.ceremonyId) || this.form.ceremonyId < 1) {
      return 'L’ID cérémonie doit être un nombre valide.';
    }
    return null;
  }

  loadGuests(): void {
    this.error = '';
    this.guestsService.findAll().subscribe({
      next: (data) => {
        this.guests = data;
      },
      error: () => {
        this.error = 'Impossible de charger les invités.';
      }
    });
  }

  editGuest(guest: Guest): void {
    this.editingId = guest.id;
    this.error = '';
    this.form = {
      name: guest.name,
      type: guest.type,
      seatCount: guest.seatCount,
      ceremonyId: guest.ceremonyId,
      remarks: guest.remarks ?? ''
    };
  }

  resetForm(): void {
    this.editingId = null;
    this.error = '';
    this.form = {
      name: '',
      type: 'Famille',
      seatCount: 1,
      ceremonyId: 1,
      remarks: ''
    };
  }

  saveGuest(): void {
    if (this.isSaving) {
      return;
    }

    const validationError = this.validateGuestForm();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.isSaving = true;
    this.error = '';

    const request = this.editingId
      ? this.guestsService.update(this.editingId, this.form)
      : this.guestsService.create(this.form);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.resetForm();
        this.loadGuests();
      },
      error: (err) => {
        this.isSaving = false;
        this.error = err?.error?.message ?? 'Échec lors de l’enregistrement de l’invité.';
      }
    });
  }

  deleteGuest(id: number): void {
    if (this.isSaving || this.isImporting) {
      return;
    }

    this.guestsService.remove(id).subscribe({
      next: () => this.loadGuests(),
      error: (err) => {
        this.error = err?.error?.message ?? 'Échec de suppression de l’invité.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  importCsv(): void {
    if (this.isImporting) {
      return;
    }

    if (!Number.isFinite(this.importCeremonyId) || this.importCeremonyId < 1) {
      this.error = 'Merci de saisir un ID cérémonie valide pour l’import.';
      return;
    }

    if (!this.selectedFile) {
      this.error = 'Merci de sélectionner un fichier CSV.';
      return;
    }

    this.isImporting = true;
    this.error = '';

    this.guestsService.importGuests(this.importCeremonyId, this.selectedFile).subscribe({
      next: () => {
        this.isImporting = false;
        this.selectedFile = null;
        this.loadGuests();
      },
      error: (err) => {
        this.isImporting = false;
        this.error = err?.error?.message ?? 'Échec de l’import CSV.';
      }
    });
  }
}
