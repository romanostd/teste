import { Component, inject, signal, type OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { HospitalsService, type Hospital } from '../../../generated';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'hospitals',
  templateUrl: './hospitals.component.html',
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
  providers: [HospitalsService, ConfirmationService, MessageService],
})
export class HospitalsComponent implements OnInit {
  private hospitalsService = inject(HospitalsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  hospitals = signal<Hospital[]>([]);
  addVisible = signal(false);
  editVisible = signal(false);
  deleteVisible = signal(false);
  currentEdit = signal<Hospital>({});
  newHospital = signal<Hospital>({});

  ngOnInit(): void {
    this.fetchHospitals();
  }

  private fetchHospitals() {
    this.hospitalsService.apiHospitalsGet().subscribe((res) => {
      this.hospitals.set(res);
    });
  }

  showAddDialog() {
    this.addVisible.set(true);
  }

  showEditDialog(id: number) {
    this.editVisible.set(true);
    this.currentEdit.set(this.hospitals().find((h) => h.id === id)!);
  }

  showDeleteDialog(id: number) {
    this.editVisible.set(true);
    this.currentEdit.set(this.hospitals().find((h) => h.id === id)!);
  }

  add() {
    this.addVisible.set(false);
    this.hospitalsService
      .apiHospitalsPost(this.newHospital(), 'response')
      .subscribe((res) => {
        if (!res.ok) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error adding hospital',
            life: 3000,
          });
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucess',
          detail: 'Hospital successfully added',
          life: 3000,
        });

        this.fetchHospitals();
      });
  }

  edit() {
    this.hospitalsService
      .apiHospitalsIdPut(this.currentEdit().id!, this.currentEdit(), 'response')
      .subscribe((res) => {
        if (!res.ok) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error updating hospital',
            life: 3000,
          });
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucess',
          detail: 'Hospital successfully updated',
          life: 3000,
        });

        this.fetchHospitals();
        this.editVisible.set(false);
        this.currentEdit.set({});
      });
  }

  delete(id: number) {
    this.hospitalsService
      .apiHospitalsIdDelete(id, 'response')
      .subscribe((res) => {
        if (!res.ok) {
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error deleting hospital',
            life: 3000,
          });
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucess',
          detail: 'Hospital successfully deleted',
          life: 3000,
        });

        this.fetchHospitals();
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
