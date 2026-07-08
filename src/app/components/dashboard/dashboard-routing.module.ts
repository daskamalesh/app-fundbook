import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LandingComponent } from '../pages/landing/landing.component';
import { BillComponent } from '../pages/bill/bill.component';
import { ExpenseComponent } from '../pages/expense/expense.component';
import { UtilitiesComponent } from '../pages/utilities/utilities.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { GroceryComponent } from '../pages/grocery/grocery.component';
import { UpdateUsernameComponent } from '../common/update-username/update-username.component';
import { UpdatePasswordComponent } from '../common/update-password/update-password.component';
import { ViewUsersComponent } from '../common/view-users/view-users.component';
import { BudgetComponent } from '../pages/budget/budget.component';
import { UserAdminComponent } from '../pages/user-admin/user-admin.component';
import { UtilityAdminComponent } from '../pages/utility-admin/utility-admin.component';
import { MonthConfigComponent } from '../pages/month-config/month-config.component';


const routes: Routes = [
 
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'landing',
        component: LandingComponent,
        data: {
          pageTitle: 'Dashboard:Fundbook',
        },
      },
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
     
      //pages start ---------------------------------------------------------------------    
      {
        path: 'bill', component: BillComponent,
        data: {
          pageTitle: 'Bill:Fundbook',
        },
      },
      {
        path: 'expense', component: ExpenseComponent,
        data: {
          pageTitle: 'Expense:Fundbook',
        },
      },
      {
        path: 'utilities', component: UtilitiesComponent,
        data: {
          pageTitle: 'Utilities:Fundbook',
        },
      },
      {
        path: 'grocery', component: GroceryComponent,
        data: {
          pageTitle: 'Grocery:Fundbook',
        },
      },
      {
        path: 'profile', component: ProfileComponent,
        data: {
          pageTitle: 'Profile:Fundbook',
        }
      },
      //admin pages start ---------------------------------------------------------------------
      {
        path: 'budget', component: BudgetComponent,
        data: {
          pageTitle: 'Profile:Budget',
        }
      },
      {
        path: 'user_admin', component: UserAdminComponent,
        data: {
          pageTitle: 'Profile:User',
        }
      },
      {
        path: 'utility_admin', component: UtilityAdminComponent,
        data: {
          pageTitle: 'Profile:Utility',
        }
      },
      {
        path: 'month_config', component: MonthConfigComponent,
        data: {
          pageTitle: 'Profile:Month Configuration',
        }
      },  
      //pages end ---------------------------------------------------------------------
      //common pages start ---------------------------------------------------------------------
      {
        path: 'update_username', component: UpdateUsernameComponent,
        data: {
          pageTitle: 'Profile:Update Username',
        },
      },
      {
        path: 'update_password', component: UpdatePasswordComponent,
        data: {
          pageTitle: 'Profile:Update Password',
        },
      },
      {
        path: 'view_user', component: ViewUsersComponent,
        data: {
          pageTitle: 'Profile:View Users',
        },
      }  
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
