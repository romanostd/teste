import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'shifts',
    loadComponent: () =>
      import('./pages/shifts/shifts.component').then((m) => m.ShiftsComponent),
  },
  {
    path: 'doctors',
    loadComponent: () =>
      import('./pages/doctors/doctors.component').then(
        (m) => m.DoctorsComponent
      ),
  },
  {
    path: 'hospitals',
    loadComponent: () =>
      import('./pages/hospitals/hospitals.component').then(
        (m) => m.HospitalsComponent
      ),
  },
  {
    path: 'specialties',
    loadComponent: () =>
      import('./pages/specialties/specialties.component').then(
        (m) => m.SpecialtiesComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports.component').then(
        (m) => m.ReportsComponent
      ),
  },
];
