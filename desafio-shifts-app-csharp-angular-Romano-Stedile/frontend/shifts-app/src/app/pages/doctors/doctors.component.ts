import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DoctorsService, type Doctor } from '../../../generated';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'doctors',
  templateUrl: './doctors.component.html',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    Dialog,
    InputTextModule,
    FormsModule,
    ConfirmPopupModule,
    ToastModule,
  ],
  providers: [DoctorsService, ConfirmationService, MessageService],
})
export class DoctorsComponent {
  private doctorsService = inject(DoctorsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  doctors = signal<Doctor[]>([]);
  addVisible = signal(false);
  editVisible = signal(false);
  deleteVisible = signal(false);
  currentEdit = signal<Doctor>({});
  newDoctor = signal<Doctor>({});

  ngOnInit(): void {
    this.fetchDoctors();
  }

  private fetchDoctors() {
    this.doctorsService.apiDoctorsGet().subscribe((res) => {
      this.doctors.set(res);
    });
  }

  showAddDialog() {
    this.addVisible.set(true);
  }

  showEditDialog(id: number) {
    this.editVisible.set(true);
    this.currentEdit.set(this.doctors().find((h) => h.id === id)!);
  }

  showDeleteDialog(id: number) {
    this.editVisible.set(true);
    this.currentEdit.set(this.doctors().find((h) => h.id === id)!);
  }

  add() {
    this.addVisible.set(false);
    this.doctorsService
      .apiDoctorsPost(this.newDoctor(), 'response')
      .subscribe((res) => {
        if (!res.ok) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error adding docotr',
            life: 3000,
          });
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucess',
          detail: 'Doctor successfully added',
          life: 3000,
        });

        this.fetchDoctors();
      });
  }

  edit() {
    this.doctorsService
      .apiDoctorsIdPut(this.currentEdit().id!, this.currentEdit(), 'response')
      .subscribe((res) => {
        if (!res.ok) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error updating doctor',
            life: 3000,
          });
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucess',
          detail: 'Doctor successfully updated',
          life: 3000,
        });

        this.fetchDoctors();
        this.editVisible.set(false);
        this.currentEdit.set({});
      });
  }

  delete(id: number) {
    this.doctorsService.apiDoctorsIdDelete(id, 'response').subscribe((res) => {
      if (!res.ok) {
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Error deleting doctor',
          life: 3000,
        });
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Sucess',
        detail: 'Doctor successfully deleted',
        life: 3000,
      });

      this.fetchDoctors();
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
