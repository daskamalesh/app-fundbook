import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { HttpCallService } from '../../../shared/services/http-call.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../shared/services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  imports: [DataTablesModule, FormsModule, CommonModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  record: any = {
    MonthID: null,
    UserID: null,
    IsActive: false,
    showOnlyMine: false
  }
  postData: any;
  url: any;
  userDeatilInfo: any;
  showTable: boolean = false;
  AllMonths: any = [];
  returnResult: any = [];
  dtOptions: Config = {};

  constructor(
    private httpcall: HttpCallService, private loaderService: LoaderService, private router: Router
  ) {
    var userDetail = localStorage.getItem('userDeatil');
    this.userDeatilInfo = JSON.parse(userDetail != undefined ? userDetail : '');
  }
  ngOnInit() {
    this.showTable = false;
    this.postData = {
      showActiveOnly: false
    }
    this.url = environment.urlApiMaster + 'GetAllMonths';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        if (v.length > 0) {
          this.AllMonths = v;
          const activeMonths = this.AllMonths.filter(month => month.IsCurrent);
          this.record.MonthID = activeMonths.length > 0 ? activeMonths[0].ID : null;

          //this.AllMonths.unshift({ ID: undefined, Description: "-select month-" });
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
    this.router.navigate(['/dashboard/landing']);
  }
  onChangeFilter() {
    this.returnResult = [];
    this.showTable = false;
    this.onClickView();
  }

  onClickView() {
    this.postData = {
      UserID: this.record.showOnlyMine ? (this.userDeatilInfo.UserID != undefined ? this.userDeatilInfo.UserID : 0) : 0,
      TransactionTypeID: 0,
      MonthID: this.record.MonthID != undefined ? this.record.MonthID : 0
    }
    var endPoint = this.record.showOnlyMine == true ? 'GetItemsMonthUserWise' : 'GetItemsMonthWise';
    this.url = environment.urlApiItem + endPoint;
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        this.showTable = true;
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

}
