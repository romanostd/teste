import { Component, inject, signal, type OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
  DoctorsService,
  HospitalsService,
  ShiftsService,
  SpecialtiesService,
  type Doctor,
  type Hospital,
  type Shift,
} from '../../../generated';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';

@Component({
  standalone: true,
  selector: 'shifts',
  templateUrl: './shifts.component.html',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    Dialog,
    InputTextModule,
    FormsModule,
    ConfirmPopupModule,
    ToastModule,
    DatePicker,
    Select,
  ],
  providers: [
    DoctorsService,
    HospitalsService,
    ShiftsService,
    ConfirmationService,
    MessageService,
  ],
})
export class ShiftsComponent implements OnInit {
  private readonly shiftsService = inject(ShiftsService);
  private readonly doctorsService = inject(DoctorsService);
  private readonly hospitalsService = inject(HospitalsService);
  private readonly specialtiesService = inject(SpecialtiesService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  shifts = signal<Shift[]>([]);
  doctors = signal<Doctor[]>([]);
  hospitals = signal<Hospital[]>([]);
  addVisible = signal(false);
  editVisible = signal(false);
  deleteVisible = signal(false);
  currentEdit = signal<Shift>({});
  newShift = signal<Shift>({});
  specialties = signal<string[]>([]);

  ngOnInit(): void {
    this.fetchShifts();
    this.fetchDoctors();
    this.fetchHospitals();
    this.fetchSpecialties();
  }

  private fetchShifts() {
    this.shiftsService.apiShiftsGet().subscribe((res) => {
      this.shifts.set(res);
    });
  }
  private fetchDoctors() {
    this.doctorsService.apiDoctorsGet().subscribe((res) => {
      this.doctors.set(res);
    });
  }
  private fetchHospitals() {
    this.hospitalsService.apiHospitalsGet().subscribe((res) => {
      this.hospitals.set(res);
    });
  }

  private fetchSpecialties(): void {
    this.specialtiesService
      .apiSpecialtiesGet()
      .subscribe((s) => this.specialties.set(s));
  }

  showAddDialog() {
    this.addVisible.set(true);
  }

  showEditDialog(id: number) {
    this.editVisible.set(true);
    this.currentEdit.set(this.shifts().find((h) => h.id === id)!);
  }

  showDeleteDialog(id: number) {
    this.editVisible.set(true);
    this.currentEdit.set(this.shifts().find((h) => h.id === id)!);
  }

  add() {
    this.addVisible.set(false);
    this.shiftsService
      .apiShiftsPost(this.newShift(), 'response')
      .subscribe((res) => {
        if (!res.ok) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error adding shift',
            life: 3000,
          });
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucess',
          detail: 'Shift successfully added',
          life: 3000,
        });

        this.fetchShifts();
      });
  }

  edit() {
    this.shiftsService
      .apiShiftsIdPut(this.currentEdit().id!, this.currentEdit(), 'response')
      .subscribe((res) => {
        if (!res.ok) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error updating shift',
            life: 3000,
          });
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucess',
          detail: 'Shift successfully updated',
          life: 3000,
        });

        this.fetchShifts();
        this.editVisible.set(false);
        this.currentEdit.set({});
      });
  }

  delete(id: number) {
    this.shiftsService.apiShiftsIdDelete(id, 'response').subscribe((res) => {
      if (!res.ok) {
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Error deleting shift',
          life: 3000,
        });
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Sucess',
        detail: 'Shift successfully deleted',
        life: 3000,
      });

      this.fetchShifts();
    });
  }

  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.delete(id);
      },
      reject: () => {},
    });
  }
}
