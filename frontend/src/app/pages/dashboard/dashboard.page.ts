import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CeremoniesService } from '../../core/services/ceremonies.service';
import { GuestsService } from '../../core/services/guests.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage implements OnInit {
  private readonly ceremoniesService = inject(CeremoniesService);
  private readonly guestsService = inject(GuestsService);

  ceremoniesCount = 0;
  guestsCount = 0;
  presentCount = 0;

  ngOnInit(): void {
    this.ceremoniesService.findAll().subscribe((data) => {
      this.ceremoniesCount = data.length;
    });

    this.guestsService.findAll().subscribe((data) => {
      this.guestsCount = data.length;
      this.presentCount = data.filter((guest) => guest.status === 'PRESENT').length;
    });
  }
}
