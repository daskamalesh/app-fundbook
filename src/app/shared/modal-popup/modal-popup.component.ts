import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-modal-popup',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './modal-popup.component.html',
  styleUrl: './modal-popup.component.css',
})
export class ModalPopupComponent {
  showPopUp = false;
  modalData: any = {};

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.action === 'open') {
        this.modalData = state.data;  // Store the modal data
        this.showPopUp = true;
      } else if (state.action === 'close') {
        this.showPopUp = false;
      }
    });
  }

  OkPopUp() {
    this.showPopUp = false;
    if (this.modalData.callback) {
      this.modalData.callback(); // Execute callback if defined
    }
  }

  closePopUp() {
    this.showPopUp = false;
  }
}
