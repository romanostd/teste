import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'shifts-form',
  templateUrl: './form.component.html',
  imports: [TableModule, CommonModule],
})
export class ShiftsFormComponent {}
