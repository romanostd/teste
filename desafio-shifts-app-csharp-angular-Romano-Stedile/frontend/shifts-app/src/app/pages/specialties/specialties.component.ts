import { Component, inject, signal, type OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ApiModule, SpecialtiesService } from '../../../generated';

@Component({
  standalone: true,
  selector: 'specialties',
  templateUrl: './specialties.component.html',
  imports: [TableModule, CommonModule, ApiModule],
  providers: [],
})
export class SpecialtiesComponent implements OnInit {
  private readonly specialtiesService = inject(SpecialtiesService);

  specialties = signal<string[]>([]);

  ngOnInit(): void {
    this.specialtiesService
      .apiSpecialtiesGet()
      .subscribe((s) => this.specialties.set(s));
  }
}
