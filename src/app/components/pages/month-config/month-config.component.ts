import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { HttpCallService } from '../../../shared/services/http-call.service';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-month-config',
  imports: [DataTablesModule, FormsModule, CommonModule],
  templateUrl: './month-config.component.html',
  styleUrl: './month-config.component.css'
})
export class MonthConfigComponent {
  record: any = {
    StartDate: null,
    EndDate: null,
    Description: null,
    ID: null,
    IsActive: false,
    Amount: null,
    IsCurrent: false
  }
  postData: any;
  url: any;
  userDeatilInfo: any;
  step: any = 0;
  AllMonths: any = [];
  returnResult: any = [];
  dtOptions: Config = {};
  frmName: any;

  constructor(
    private httpcall: HttpCallService, private modalService: ModalService, private router: Router
  ) {
    var userDetail = localStorage.getItem('userDeatil');
    this.userDeatilInfo = JSON.parse(userDetail != undefined ? userDetail : '');
  }
  ngOnInit() {
    // this.showTable = false;
    this.postData = {
      showActiveOnly: false
    }
    this.url = environment.urlApiMaster + 'GetAllMonths';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        if (v.length > 0) {
          this.AllMonths = v;

          //this.AllMonths.unshift({ ID: undefined, Description: "-select month-" });
          this.step = 1;
          this.onClickView();
        } else {
          this.AllMonths = [];
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
      },
    });
  }
  BackToDashboard() {
    if (this.step == 1) {
      this.router.navigate(['/dashboard/landing']);
    } else {
      this.step = this.step - 1;
    }
  }
  onClickEdit(d: any) {
    this.postData = {
      ID: d != undefined ? d.ID : 0,
    }
    this.url = environment.urlApiMaster + 'GetMonthConfigureByID';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        // this.showTable = true;
        if (v != undefined) {
          this.record = JSON.parse(v.ResultValue);
          this.record.editMode = true;
          this.step = this.step + 1;
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          lengthMenu: [10, 15, 25, 50],
          processing: true,
        };
      },
    });
  }
  // onClickCreate() {
  //   this.record = {};
  //   this.record.editMode = false;
  //   this.step = this.step + 1;
  // }
  onClickView() {
    this.postData = {
      LoginRoleID: 0,
      showActiveOnly: false
    }
    this.url = environment.urlApiMaster + 'GetAllMonths';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        // this.showTable = true;
        if (v.length > 0) {
          this.returnResult = v;
        } else {
          this.returnResult = [];
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          lengthMenu: [10, 15, 25, 50],
          processing: true,
        };
      },
    });
  }

  onClickSubmit(frmTab: NgForm) {
    this.frmName = frmTab;
    const modalData = {
      msgHeader: 'Confirmation',
      msg: 'Are you sure you want to proceed?',
      msgClass: 'text-primary',
      iconClass: 'bi bi-exclamation-triangle-fill',
      msgHeaderClass: 'bg-info',
      showCancel: true,
      callback: this.Save.bind(this, this.frmName) // Passing the Save method as a callback
    };

    this.modalService.openModal(modalData); // Open modal with data
  }

  Save(frmTab: NgForm) {
    this.frmName = frmTab;
    this.postData = {
      ID: this.record.ID != undefined ? this.record.ID : 0,
      StartDate: this.record.StartDate != undefined ? this.record.StartDate : '',
      EndDate: this.record.EndDate != undefined ? this.record.EndDate : '',
      Description: this.record.Description != undefined ? this.record.Description : '',
      Amount: this.record.Amount != undefined ? this.record.Amount : 0,
      IsActive: false,
      IsCurrent: this.record.IsCurrent != undefined ? this.record.IsCurrent : false
    }
    var endUrl = 'ConfigureMonth';
    this.url = environment.urlApiMaster + endUrl;
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
          this.postData = {};
          this.frmName.resetForm();
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
      complete: () => { },
    });
  }

}
