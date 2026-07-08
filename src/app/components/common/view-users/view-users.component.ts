import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpCallService } from '../../../shared/services/http-call.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-users',
  imports: [CommonModule],
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.css'
})
export class ViewUsersComponent {
  postData: any;
  url: any;
  returnResult: any = [];
  AllUsers: any = [];

  constructor(private httpcall:HttpCallService, private router :Router) {

  }
  ngOnInit() {
      this.postData = {
        showActiveOnly: false
      }
      this.url = environment.urlApiUserAuth + 'GetAllUser';
      this.httpcall.httpPost(this.url, this.postData).subscribe({
        next: (v) => {
          if (v.length > 0) {
            this.AllUsers = v;
          } else {
            this.AllUsers = [];
          }
        },
        error: (e) => {
          console.error(e);
        },
        complete: () => { 
        },
      });
    }
    BackToProfile() {
      this.router.navigate(['/dashboard/profile']);
    }
}
