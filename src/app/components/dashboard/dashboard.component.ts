import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { HttpCallService } from '../../shared/services/http-call.service';
import { LoaderService } from '../../shared/services/loader.service';
import { environment } from '../../../environments/environment';
import { MenuService } from '../../shared/services/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  User_ID: any;
  postData: any;
  url: any;
  allMenu: any;
  // isActiveMenu: boolean = false;

  constructor(
    private httpcall: HttpCallService, private router: Router, private menuservice: MenuService
  ) {
    this.User_ID = localStorage.getItem('UserID');
  }
  ngOnInit() {
    this.postData = {
      UserID: this.User_ID
    }
    this.url = environment.urlApiUserAuth + 'LoginAuthenticateDetail';
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
        if (v != undefined) {
          localStorage.setItem('userDeatil', JSON.stringify(v));

           this.getAllMenus(v);
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
      },
    });
  }
  updateActiveMenu(currentRoute: string) {
    this.allMenu.forEach(m => m.isActiveMenu = 'dashboard/' + m.PageName === currentRoute.replace('/', ''));
  }

  onClickMenu(m: any) {
    this.allMenu.forEach((element: any) => {
      if (element.MenuID == m.MenuID) {
        element.isActiveMenu = true;
      } else {
        element.isActiveMenu = false;
      }
    });
  }
  getAllMenus(d:any){
    let postData = {
      LoginRoleID: d.LoginRoleID != undefined ? d.LoginRoleID : 0,
      showActiveOnly: false
    }

    this.menuservice.getMenu(postData).subscribe({
      next: (v) => {
        this.allMenu = v;
        this.allMenu = this.allMenu.map(m => ({
          ...m,
          isActiveMenu: false
        }));

        localStorage.setItem('menuDeatil', JSON.stringify(v));
        //---
        this.updateActiveMenu(this.router.url);
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            this.updateActiveMenu(event.urlAfterRedirects);
          }
        });
      },
      error: (e) => {
      },
      complete: () => { },
    });
  }
}
