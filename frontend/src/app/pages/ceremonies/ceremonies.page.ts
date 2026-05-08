import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CeremoniesService } from '../../core/services/ceremonies.service';
import { Ceremony } from '../../core/models/api.models';

@Component({
  selector: 'app-ceremonies-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ceremonies.page.html'
})
export class CeremoniesPage implements OnInit {
  private readonly ceremoniesService = inject(CeremoniesService);

  ceremonies: Ceremony[] = [];
  loading = false;
  error = '';
  editingId: number | null = null;
  isSaving = false;

  form: Omit<Ceremony, 'id'> = {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    guestCount: 1
  };

  ngOnInit(): void {
    this.loadCeremonies();
  }

  private validateForm(): string | null {
    if (!this.form.title.trim()) return 'Le titre est obligatoire.';
    if (!this.form.date) return 'La date est obligatoire.';
    if (!this.form.startTime) return 'L’heure de début est obligatoire.';
    if (!this.form.endTime) return 'L’heure de fin est obligatoire.';
    if (!this.form.location.trim()) return 'Le lieu est obligatoire.';
    if (!Number.isFinite(this.form.guestCount) || this.form.guestCount < 1) {
      return 'Le nombre d’invités doit être supérieur à 0.';
    }

    if (this.form.endTime <= this.form.startTime) {
      return 'L’heure de fin doit être après l’heure de début.';
    }

    return null;
  }

  loadCeremonies(): void {
    this.loading = true;
    this.error = '';
    this.ceremoniesService.findAll().subscribe({
      next: (data) => {
        this.ceremonies = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les cérémonies.';
        this.loading = false;
      }
    });
  }

  editCeremony(ceremony: Ceremony): void {
    this.editingId = ceremony.id;
    this.error = '';
    this.form = {
      title: ceremony.title,
      date: ceremony.date,
      startTime: ceremony.startTime,
      endTime: ceremony.endTime,
      location: ceremony.location,
      guestCount: ceremony.guestCount
    };
  }

  resetForm(): void {
    this.editingId = null;
    this.error = '';
    this.form = {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      guestCount: 1
    };
  }

  saveCeremony(): void {
    if (this.isSaving) {
      return;
    }

    const validationError = this.validateForm();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.isSaving = true;
    this.error = '';

    const request = this.editingId
      ? this.ceremoniesService.update(this.editingId, this.form)
      : this.ceremoniesService.create(this.form);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.resetForm();
        this.loadCeremonies();
      },
      error: (err) => {
        this.isSaving = false;
        this.error = err?.error?.message ?? 'Échec lors de l’enregistrement de la cérémonie.';
      }
    });
  }

  deleteCeremony(id: number): void {
    this.ceremoniesService.remove(id).subscribe({
      next: () => this.loadCeremonies(),
      error: (err) => {
        this.error = err?.error?.message ?? 'Échec de suppression de la cérémonie.';
      }
    });
  }
}
