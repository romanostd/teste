import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ApiModule } from '../generated';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, ApiModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly router = inject(Router);

  items: MenuItem[] | undefined = [
    {
      label: 'Shifts',
      icon: 'pi pi-calendar',
      command: () => {
        this.router.navigate(['/shifts']);
      },
    },
    {
      label: 'Doctors',
      icon: 'pi pi-id-card',
      command: () => {
        this.router.navigate(['/doctors']);
      },
    },
    {
      label: 'Hospitals',
      icon: 'pi pi-building',
      command: () => {
        this.router.navigate(['/hospitals']);
      },
    },
    {
      label: 'Specialties',
      icon: 'pi pi-briefcase',
      command: () => {
        this.router.navigate(['/specialties']);
      },
    },
    {
      label: 'Reports',
      icon: 'pi pi-calculator',
      command: () => {
        this.router.navigate(['/reports']);
      },
    },
  ];
}
