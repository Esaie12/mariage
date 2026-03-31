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
    const request = this.editingId
      ? this.ceremoniesService.update(this.editingId, this.form)
      : this.ceremoniesService.create(this.form);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadCeremonies();
      },
      error: () => {
        this.error = 'Échec lors de l’enregistrement de la cérémonie.';
      }
    });
  }

  deleteCeremony(id: number): void {
    this.ceremoniesService.remove(id).subscribe({
      next: () => this.loadCeremonies(),
      error: () => {
        this.error = 'Échec de suppression de la cérémonie.';
      }
    });
  }
}
