import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCallService } from '../../shared/services/http-call.service';
import { environment } from '../../../environments/environment';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  url: any;
  postData: any;
  record = {
    UserName: '',
    Password: '',
  };
  isShowPassword: boolean;
  returnResult: any;
  loginError: boolean = false;


  constructor(private router: Router, private route: ActivatedRoute, private httpcall: HttpCallService,) { }
  ngOnInit() {
    this.isShowPassword = false;
  }

  login() {
    this.postData = {
      UserName: this.record.UserName != undefined ? this.record.UserName : '',
      Password: this.record.Password != undefined ? this.record.Password : ''
    }
    this.url = environment.urlApiUserAuth + 'LoginAuthenticate';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        this.returnResult = v.UserID;
        if (this.returnResult > 0) {
          this.loginError = false;
          localStorage.setItem('UserID', this.returnResult);
          this.router.navigateByUrl('/dashboard');
        } else {
          this.loginError = true;
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => { },
    });
  }

  onClickShowPassword() {
    this.isShowPassword = !this.isShowPassword;
  }
}
