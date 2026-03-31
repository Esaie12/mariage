import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { CeremoniesPage } from './pages/ceremonies/ceremonies.page';
import { GuestsPage } from './pages/guests/guests.page';
import { CheckinPage } from './pages/checkin/checkin.page';
import { ScanPage } from './pages/scan/scan.page';

export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'ceremonies', component: CeremoniesPage },
  { path: 'guests', component: GuestsPage },
  { path: 'check-in', component: CheckinPage },
  { path: 'scan', component: ScanPage },
  { path: '**', redirectTo: '' }
];
