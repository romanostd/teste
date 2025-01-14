import { Component, inject, signal, type OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
  ApiModule,
  HospitalsService,
  ReportsService,
  type Hospital,
  type ShiftsCostReportRequest,
} from '../../../generated';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  standalone: true,
  selector: 'reports',
  templateUrl: './reports.component.html',
  imports: [
    TableModule,
    CommonModule,
    ApiModule,
    TableModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    DatePicker,
    MultiSelectModule,
    CardModule,
  ],
  providers: [],
})
export class ReportsComponent implements OnInit {
  private readonly reportsService = inject(ReportsService);
  private hospitalsService = inject(HospitalsService);

  hospitals = signal<Hospital[]>([]);

  shiftCostReport = signal<ShiftsCostReportRequest>({});

  ngOnInit(): void {
    this.fetchHospitals();
  }

  private fetchHospitals() {
    this.hospitalsService.apiHospitalsGet().subscribe((res) => {
      this.hospitals.set(res);
    });
  }

  downloadShiftCostReport() {
    this.reportsService
      .apiReportsShiftCostPost(this.shiftCostReport())
      .subscribe((res) => {
        // doing csv in javascript because it is easier
        const headers = Object.keys(res[0]);
        let csvContent = headers.map((h) => `"${h}"`).toString() + '\n';
        res.forEach(
          (r) =>
            (csvContent +=
              Object.values(r)
                .map((h) => `"${h}"`)
                .toString() + '\n')
        );

        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8,',
        });
        const objUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', objUrl);
        link.setAttribute('download', 'File.csv');
        link.hidden = true;
        const body = document?.querySelector('body');
        body?.append(link);
        link.click();
        body?.removeChild(link);
      });
  }
}
