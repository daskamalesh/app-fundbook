import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpCallService } from '../../../shared/services/http-call.service';
import { environment } from '../../../../environments/environment';
import { ModalPopupComponent } from '../../../shared/modal-popup/modal-popup.component';
import { ModalService } from '../../../shared/services/modal.service';
import { Router } from '@angular/router';
import { NumberOnlyDirective } from '../../../shared/directives/number-only.directive';

interface Month {
  ID: number;
  GroupID: number;
  Amount: number;
  IsActive: boolean;
  IsCurrent: boolean;
  Description: string;
  StartDate: string;
  EndDate: string;
  ShowActiveOnly: string;
}
@Component({
  selector: 'app-utilities',
  imports: [CommonModule, FormsModule, NumberOnlyDirective],
  templateUrl: './utilities.component.html',
  styleUrl: './utilities.component.css'
})
export class UtilitiesComponent {
  @ViewChild(ModalPopupComponent) modal!: ModalPopupComponent;
  record: any = {
    EntryDate: null,
    Description: ''
  };
  postData: any;
  userDeatilInfo: any;
  url: any;
  returnResult: any;
  tabSelected: any = 1;
  allMonths: Month[] = [];
  selectedMonth: Month | null | undefined;
  ServerDate: any;
  frmName: any;

  constructor(private httpcall: HttpCallService, private modalService: ModalService, private router: Router) {
    var userDetail = localStorage.getItem('userDeatil');
    this.userDeatilInfo = JSON.parse(userDetail != undefined ? userDetail : '');
  }
  ngOnInit() {
    this.record = {};
    this.postData = {
      LoginRoleID: 0,
      showActiveOnly: false
    }
    this.url = environment.urlApiMaster + 'GetAllMonths';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        this.allMonths = v;
        //----
        this.url = environment.urlApiCommon + 'GetCurrentDate';
        this.httpcall.httpGet(this.url).subscribe({
          next: (v) => {
            var result = v;
            this.ServerDate = result.Date;
          },
          error: (e) => {
            console.error(e);
          },
          complete: () => { },
        });
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => { },
    });
  }

  BackToDashboard() {
    this.router.navigate(['/dashboard/landing']);
  }

  onTabChange(m: any) {
    this.tabSelected = m;
    this.record = {};
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
    var reqData1 = {};
    var reqData2 = {};
    var reqData3 = {};
    var filteredMonth = this.allMonths.find((element) => this.record.MonthID === element.ID)?.Description || null;

    reqData1 = {
      UserID: this.userDeatilInfo != undefined ? this.userDeatilInfo.UserID : 0,
      Quantity: this.record.Quantity != undefined ? this.record.Quantity : 0,
      MonthID: this.selectedMonth != undefined ? this.selectedMonth.ID : 0,
      Amount: this.record.Amount != undefined ? this.record.Amount : 0,
      EntryDate: this.record.EntryDate != undefined ? this.httpcall.convertToDDMMYYYYWithSlash(this.record.EntryDate) : '01/01/1970',
      UserName: this.userDeatilInfo != undefined ? this.userDeatilInfo.UserName : '',
      IsActive: false,
      ShowActiveOnly: false
    }
    reqData2 = {
      UserID: this.userDeatilInfo != undefined ? this.userDeatilInfo.UserID : 0,
      Unit: this.record.Unit != undefined ? this.record.Unit : 0,
      MonthID: this.record.MonthID != undefined ? this.record.MonthID : 0,
      Amount: this.record.Amount != undefined ? this.record.Amount : 0,
      EntryDate: this.ServerDate != undefined ? this.httpcall.convertDateFormat(this.ServerDate) : '01/01/1970',
      FromDate: this.record.FromDate != undefined ? this.httpcall.convertToDDMMYYYYWithSlash(this.record.FromDate) : '01/01/1970',
      ToDate: this.record.ToDate != undefined ? this.httpcall.convertToDDMMYYYYWithSlash(this.record.ToDate) : '01/01/1970',
      Description:filteredMonth,
      UserName: this.userDeatilInfo != undefined ? this.userDeatilInfo.UserName : '',
      IsActive: false,
      ShowActiveOnly: false
    }
    reqData3 = {
      UserID: this.userDeatilInfo != undefined ? this.userDeatilInfo.UserID : 0,
      MonthID: this.selectedMonth != undefined ? this.selectedMonth.ID : 0,
      Amount: this.record.Amount != undefined ? this.record.Amount : 0,
      EntryDate: this.record.EntryDate != undefined ? this.httpcall.convertToDDMMYYYYWithSlash(this.record.EntryDate) : '01/01/1970',
      UserName: this.userDeatilInfo != undefined ? this.userDeatilInfo.UserName : '',
      Rent: this.selectedMonth != undefined ? this.selectedMonth.Description : '',
      IsActive: false,
      ShowActiveOnly: false
    }

    this.postData = (this.tabSelected == 1 ? reqData1 : (this.tabSelected == 2 ? reqData2 : this.tabSelected == 3 ? reqData3 : {}))
    var postUrl = (this.tabSelected == 1 ? 'AddWater' : (this.tabSelected == 2 ? 'AddElectric' : this.tabSelected == 3 ? 'AddRent' : ''))
    this.url = environment.urlApiUtility + postUrl;
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

  onEntryDateChange(entryDate: string) {
    var ed = this.httpcall.convertDateFormatForDatePicker(entryDate);
    const formattedEntryDate = this.httpcall.convertToDate(ed);

    this.selectedMonth = this.allMonths.find(month => {
      const startDate = this.httpcall.convertToDate(month.StartDate);
      const endDate = this.httpcall.convertToDate(month.EndDate);

      return formattedEntryDate >= startDate && formattedEntryDate <= endDate;
    });
  }
}
