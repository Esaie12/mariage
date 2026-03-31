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
    this.form = {
      name: '',
      type: 'Famille',
      seatCount: 1,
      ceremonyId: 1,
      remarks: ''
    };
  }

  saveGuest(): void {
    const request = this.editingId
      ? this.guestsService.update(this.editingId, this.form)
      : this.guestsService.create(this.form);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadGuests();
      },
      error: () => {
        this.error = 'Échec lors de l’enregistrement de l’invité.';
      }
    });
  }

  deleteGuest(id: number): void {
    this.guestsService.remove(id).subscribe({
      next: () => this.loadGuests(),
      error: () => {
        this.error = 'Échec de suppression de l’invité.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  importCsv(): void {
    if (!this.selectedFile) {
      this.error = 'Merci de sélectionner un fichier CSV.';
      return;
    }

    this.guestsService.importGuests(this.importCeremonyId, this.selectedFile).subscribe({
      next: () => {
        this.selectedFile = null;
        this.loadGuests();
      },
      error: () => {
        this.error = 'Échec de l’import CSV.';
      }
    });
  }
}
