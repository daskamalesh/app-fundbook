import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";



@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CommonModule,
    FormsModule,
    DataTablesModule,
    HttpClientModule,
    NgApexchartsModule
  ],
  providers: [
  ]
})
export class DashboardModule { }
