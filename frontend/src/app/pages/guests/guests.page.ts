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
    this.guestsService.findAll().subscribe((data) => {
      this.guests = data;
    });
  }

  createGuest(): void {
    this.guestsService.create(this.form).subscribe(() => {
      this.form = {
        name: '',
        type: 'Famille',
        seatCount: 1,
        ceremonyId: 1,
        remarks: ''
      };
      this.loadGuests();
    });
  }
}
