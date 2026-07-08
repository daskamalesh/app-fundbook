import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<any>(); // Observable for modal data

  // Observable stream to be used in components
  modalState$ = this.modalSubject.asObservable();

  // Method to open the modal
  openModal(data: any) {
    this.modalSubject.next({ action: 'open', data });
  }

  // Method to close the modal
  closeModal() {
    this.modalSubject.next({ action: 'close' });
  }
}
