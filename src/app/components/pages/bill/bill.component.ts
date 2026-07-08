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
  selector: 'app-bill',
  imports: [CommonModule, FormsModule, NumberOnlyDirective],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent {
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
  SettlementDataIndividual: any = {};
  AllSettlementDataUserWise = [];
  SettlementProcessData: any = [];
  showSettleSec: boolean = false;
  showSettleProcessSec: boolean = false;
  showIndividual: boolean = false;
  ServerDate: any;
  selectedMonth: Month | null | undefined;
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
        //---------
        this.postData = {
        }
        this.url = environment.urlApiItem + 'GetSettlementData';
        this.httpcall.httpPost(this.url, this.postData).subscribe({
          next: (v) => {
            var returnResult = (v.length > 0 ? v[0] : []);
            this.SettlementDataIndividual.GrandTotalExpenditureAmount = returnResult.GrandTotalExpenditureAmount;
            this.SettlementDataIndividual.AmountPerHead = returnResult.AmountPerHead;
            //----
            this.postData = {
            }
            this.url = environment.urlApiItem + 'GetSettlementDataUserWise';
            this.httpcall.httpPost(this.url, this.postData).subscribe({
              next: (v) => {
                this.AllSettlementDataUserWise = v;
                // this.AllSettlementDataUserWise = v.map(user => ({
                //   ...user,
                //   userHasAmountToTake: user.UserID === this.userDeatilInfo.UserID && user.AmountToTake > 0
                // }));
                //----
                this.postData = {
                  UserID: this.userDeatilInfo.UserID != undefined ? this.userDeatilInfo.UserID : 0,
                  ItemID: 0
                }
                this.url = environment.urlApiItem + 'GetSettlementDataByUserID';
                this.httpcall.httpPost(this.url, this.postData).subscribe({
                  next: (v) => {
                    this.SettlementProcessData = v;
                    //----
                    this.url = environment.urlApiCommon + 'GetCurrentDate';
                    this.httpcall.httpGet(this.url).subscribe({
                      next: (v) => {
                        var result = v;
                        this.ServerDate = result.Date;
                        //--
                        this.showSettleSec = false;
                        this.showSettleProcessSec = false;
                        this.showIndividual = false;
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
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => { },
    });
  }
  hasAmountToGive(userID: number): boolean {
    const user = this.AllSettlementDataUserWise.find(u => u.UserID === userID);
    return user ? user.AmountToGive > 0 : false;
  }

  BackToDashboard() {
    this.router.navigate(['/dashboard/landing']);
  }
  onTabChange(m: any) {
    this.tabSelected = m;
    this.record = {};
  }
  onClickSettle(d: any) {
    this.showSettleSec = true;
    this.record.DonatedUserID = d.UserID;
    this.record.DonationUserName = d.UserName;
    this.record.DonationAmt = d.AmountToTake;
    this.record.EntryDate = this.httpcall.convertToDDMMYYYY(this.ServerDate);
    this.onEntryDateChange(this.record.EntryDate);
  }
  onClickCloseSettle() {
    this.showSettleSec = false;
    this.record.DonatedUserID = undefined;
    this.record.DonationUserName = undefined;
    this.record.DonationAmt = undefined;
    this.record.EntryDate = undefined;
  }
  onClickViewNotificattion(d: any) {
    this.showSettleProcessSec = true;
    this.record.SettlementItemID = undefined;
  }
  onClickCloseNotificattion() {
    this.showSettleProcessSec = false;
    this.record.SettlementItemID = undefined;
  }

  onClickAcceptSettlement(SettlementItemID: any) {
    const modalData = {
      msgHeader: 'Confirmation',
      msg: 'Are you sure you have received that amount?',
      msgClass: 'text-primary',
      iconClass: 'bi bi-exclamation-triangle-fill',
      msgHeaderClass: 'bg-info',
      showCancel: true,
      callback: this.EditSettlement.bind(this)
    };
    this.record.SettlementItemID = SettlementItemID;
    this.modalService.openModal(modalData); // Open modal with data
  }

  onClickViewIndividual() {
    this.showIndividual = true;
  }
  onClickCloseIndivisual() {
    this.showIndividual = false;
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
      UserID: this.userDeatilInfo != undefined ? this.userDeatilInfo.UserID : 0,
      DonationUserID: this.tabSelected != undefined ? (this.tabSelected == 2 ? this.record.DonatedUserID : 0) : 0,
      ID: this.record.ID != undefined ? this.record.ID : 0,
      MonthID: this.selectedMonth != undefined ? this.selectedMonth.ID : 0,
      TransactionTypeID: this.tabSelected != undefined ? this.tabSelected : 0,
      Amount: this.record.Amount != undefined ? this.record.Amount : 0,
      IsActive: false,
      IsAccepted: false,
      Description: this.record.Description != undefined ? this.record.Description : '',
      Date: this.record.EntryDate != undefined ? this.httpcall.convertToDDMMYYYYWithSlash(this.record.EntryDate) : '01/01/1970',
      ImportDate: this.ServerDate != undefined ? this.httpcall.convertDateFormat(this.ServerDate) : '01/01/1970',
      UserName: this.userDeatilInfo != undefined ? this.userDeatilInfo.UserName : '',
      DonationUserName: (this.tabSelected == 2 && this.record.DonationUserName != undefined ? this.record.DonationUserName : ''),
      TransactionType: this.tabSelected != undefined ? (this.tabSelected == 1 ? 'Debit' : 'Credit') : "",
      ShowActiveOnly: "No"
    }
    this.url = environment.urlApiItem + 'AddItem';
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

  EditSettlement() {
    this.postData = {
      UserID: 0,
      ItemID: this.record.SettlementItemID != undefined ? this.record.SettlementItemID : 0
    }
    this.url = environment.urlApiItem + 'EditSettlementData';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        this.returnResult = v;
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
