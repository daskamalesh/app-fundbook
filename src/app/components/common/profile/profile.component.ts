import { Component } from '@angular/core';
import { HttpCallService } from '../../../shared/services/http-call.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FileHandleService } from '../../../shared/services/file-handle.service';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
 User_ID: any;
  postData: any;
  url: any;
  allMenu: any;
  userDeatilInfo: any;

  constructor(
    private httpcall: HttpCallService, private file_service: FileHandleService, private router:Router, private modalService: ModalService
  ) {
    this.User_ID = localStorage.getItem('UserID');
    var userDetail = localStorage.getItem('userDeatil');
    this.userDeatilInfo = JSON.parse(userDetail != undefined ? userDetail : '');
  }
  ngOnInit() {
  }
  
  BackToDashboard() {
    this.router.navigate(['/dashboard/landing']);
  }
  
  onClickUpdateUserName(){
    this.router.navigate(['/dashboard/update_username']);
  }
  onClickUpdatePassword(){
    this.router.navigate(['/dashboard/update_password']);
  }
  onClickExportData(){
    this.url = environment.urlApiBackup + 'ManualDailyBackupViaMail';
    this.httpcall.httpGet(this.url).subscribe({
      next: (v) => {
        var result = v;
        if ((result != undefined) && (result === 'Backup email sent successfully.')) {
           const modalData = {
            msgHeader: 'Success',
            msg: result,
            msgClass: 'text-success',
            iconClass: 'bi bi-check2-circle',
            msgHeaderClass: 'bg-success', // Fixed typo from 'bg-sucess' to 'bg-success'
            showCancel: true
          };

          this.modalService.openModal(modalData);
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
  onClickDownload(format:any){
    this.url = environment.urlApiBackup + 'DownloadItemBackup';
    this.httpcall.downloadFileWithFormat(this.url,format).subscribe({
      next: (v) => {
        var result = v;
        if (result && result.FileData) {
          this.file_service.saveFile(result.FileData, result.FileName);
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
  onClickViewUsers(){
    this.router.navigate(['/dashboard/view_user']);
  }
  onClickLogOut(){
    const modalData = {
      msgHeader: 'Confirmation',
      msg: 'Are you sure you want to logout ?',
      msgClass: 'text-primary',
      iconClass: 'bi bi-exclamation-triangle-fill',
      msgHeaderClass: 'bg-info',
      showCancel: true,
      callback: this.LogOut.bind(this) // Passing the Save method as a callback
    };

    this.modalService.openModal(modalData); // Open modal with data
  }
  LogOut(){
    localStorage.removeItem('UserID');
    localStorage.removeItem('userDeatil');
    localStorage.removeItem('menuDeatil');
    this.router.navigate(['/logout']);
  }
}
