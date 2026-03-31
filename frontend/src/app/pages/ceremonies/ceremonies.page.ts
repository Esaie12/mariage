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
    this.ceremoniesService.findAll().subscribe({
      next: (data) => {
        this.ceremonies = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  createCeremony(): void {
    this.ceremoniesService.create(this.form).subscribe(() => {
      this.form = {
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        guestCount: 1
      };
      this.loadCeremonies();
    });
  }
}
