import { Component } from '@angular/core';
import { HttpCallService } from '../../../shared/services/http-call.service';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../shared/services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-username',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-username.component.html',
  styleUrl: './update-username.component.css'
})
export class UpdateUsernameComponent {
  record: any = {
    MonthID: null,
    UserID: null,
    IsActive: false,
    OnlyMine: false
  }
  postData: any;
  url: any;
  User_ID: any = 0;
  userDeatilInfo: any;
  returnResult: any = [];

  constructor(
    private httpcall: HttpCallService, private modalService: ModalService, private router: Router
  ) {
    this.User_ID = localStorage.getItem('UserID');
    var userDetail = localStorage.getItem('userDeatil');
    this.userDeatilInfo = JSON.parse(userDetail != undefined ? userDetail : '');
  }
  ngOnInit() {
    this.record.UserName = this.userDeatilInfo.UserName;
  }
  BackToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }
  onClickSubmit(frmTab1: NgForm) {
    const modalData = {
      msgHeader: 'Confirmation',
      msg: 'Are you sure you want to proceed?',
      msgClass: 'text-primary',
      iconClass: 'bi bi-exclamation-triangle-fill',
      msgHeaderClass: 'bg-info',
      showCancel: true,
      callback: this.Save.bind(this, frmTab1) // Passing the Save method as a callback
    };

    this.modalService.openModal(modalData); // Open modal with data
  }
  Save(frmTab1: NgForm) {
    this.postData = {
      UserID: this.userDeatilInfo.UserID != undefined ? this.userDeatilInfo.UserID : 0,
      NewUserName: this.record.NewUsername != undefined ? this.record.NewUsername : ''
    }
    this.url = environment.urlApiUserAuth + 'UpdateUserName';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        this.returnResult = v.UserID;
        if (this.returnResult > 0) {
          const modalData = {
            msgHeader: 'Success',
            msg: 'Data saved successfully.',
            msgClass: 'text-success',
            iconClass: 'bi bi-check2-circle',
            msgHeaderClass: 'bg-success', // Fixed typo from 'bg-sucess' to 'bg-success'
            showCancel: true
          };

          this.modalService.openModal(modalData);
          frmTab1.resetForm();
          // this.ngOnInit();
          this.router.navigate(['/dashboard/profile']);
        } else {
          const modalData = {
            msgHeader: 'Failure',
            msg: 'Data could not be saved.',
            msgClass: 'text-danger',
            iconClass: 'bi bi-x-circle',
            msgHeaderClass: 'bg-danger',
            showCancel: false // No cancel button for failure
          };

          this.modalService.openModal(modalData);
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => { }
    });
  }
}
