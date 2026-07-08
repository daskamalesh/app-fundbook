import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { HttpCallService } from '../../../shared/services/http-call.service';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../shared/services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grocery',
  imports: [DataTablesModule, FormsModule, CommonModule],
  templateUrl: './grocery.component.html',
  styleUrl: './grocery.component.css'
})
export class GroceryComponent {
  record: any = {
    MonthID: null,
    UserID: null,
    IsActive: false,
    OnlyMine: false
  }
  postData: any;
  url: any;
  userDeatilInfo: any;
  AllQuantityType: any = [];
  returnResult: any = [];
  AllGrocery: any = [];
  dtOptions: Config = {};

  constructor(
    private httpcall: HttpCallService, private modalService: ModalService, private router:Router
  ) {
    var userDetail = localStorage.getItem('userDeatil');
    this.userDeatilInfo = JSON.parse(userDetail != undefined ? userDetail : '');
  }
  ngOnInit() {
    this.postData = {
      showActiveOnly: false
    }
    this.url = environment.urlApiMaster + 'GetAllQuantityType';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        if (v.length > 0) {
          this.AllQuantityType = v;
          this.record = {
            MonthID: null,
            UserID: null,
            IsActive: false,
            OnlyMine: false
          }
          this.record.QuantityTypeID = this.AllQuantityType[0].ID;
        } else {
          this.AllQuantityType = [];
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
      },
    });
    this.onClickView();
  }
  BackToDashboard() {
    this.router.navigate(['/dashboard/landing']);
  }
  onChangeFilter() {
    this.returnResult = [];
  }
  onClickSubmit(frmTab1: NgForm) {
    const modalData = {
      msgHeader: 'Confirmation',
      msg: 'Are you sure you want to proceed?',
      msgClass: 'text-primary',
      iconClass: 'bi bi-exclamation-triangle-fill',
      msgHeaderClass: 'bg-info',
      showCancel: true,
      callback: this.Save.bind(this,frmTab1) // Passing the Save method as a callback
    };

    this.modalService.openModal(modalData); // Open modal with data
  }
  Save(frmTab1: NgForm) {
    const qType = this.AllQuantityType.find(
      (element: any) => element.ID === parseInt(this.record.QuantityTypeID)
    )?.QuantityType;
    this.postData = {
      UserID: this.userDeatilInfo.UserID != undefined ? this.userDeatilInfo.UserID : 0,
      Quantity: this.record.Quantity != undefined ? this.record.Quantity : 0,
      QuantityTypeID: this.record.QuantityTypeID != undefined ? this.record.QuantityTypeID : 0,
      IsActive: false,
      Description: this.record.Description != undefined ? this.record.Description : '',
      UserName: this.userDeatilInfo.UserName != undefined ? this.userDeatilInfo.UserName : '',
      ShowActiveOnly: false,
      QuantityType: qType != undefined ? qType : ''
    }
    this.url = environment.urlApiUtility + 'AddGrocery';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        this.returnResult = v.ResultValue;
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
          this.ngOnInit();
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

  onClickView() {
    this.postData = {
      LoginRoleID: 0,
      showActiveOnly: false
    }
    this.url = environment.urlApiUtility + 'GetAllGrocery';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        if (v.length > 0) {
          this.AllGrocery = v;
        } else {
          this.AllGrocery = [];
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
      },
    });
  }

  onClickDelete(id: any) {
    this.record.DeleteGroceryID = (id != undefined ? id : 0);
    const modalData = {
      msgHeader: 'Delete',
      msg: 'Are you sure you want to delete?',
      msgClass: 'text-danger',
      iconClass: 'bi bi-exclamation-triangle-fill',
      msgHeaderClass: 'bg-info',
      showCancel: true,
      callback: this.Delete.bind(this) // Passing the Save method as a callback
    };

    this.modalService.openModal(modalData); // Open modal with data
  }
  Delete() {
    this.postData = {
      ID: this.record.DeleteGroceryID != undefined ? this.record.DeleteGroceryID : 0
    }
    this.url = environment.urlApiUtility + 'DeleteGrocery';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        this.returnResult = v.ResultValue;
        if (this.returnResult > 0) {
          const modalData = {
            msgHeader: 'Success',
            msg: 'Deleted successfully.',
            msgClass: 'text-success',
            iconClass: 'bi bi-check2-circle',
            msgHeaderClass: 'bg-danger', // Fixed typo from 'bg-sucess' to 'bg-success'
            showCancel: true
          };

          this.modalService.openModal(modalData);
          this.postData = {};
          this.onClickView();
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
