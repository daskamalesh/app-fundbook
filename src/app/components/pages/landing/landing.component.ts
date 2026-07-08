import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { HttpCallService } from '../../../shared/services/http-call.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import { race } from 'rxjs';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions?: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};
interface Expenditure {
  color: string;
  TotalExpenditure: number;
  UserName: string;
}
@Component({
  selector: 'app-landing',
  imports: [DataTablesModule, FormsModule, CommonModule, NgApexchartsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild("chart") chart: ChartComponent | undefined;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  public chartOptions: Partial<ChartOptions> = {};

  record: any = {
    MonthID: null,
    UserID: null,
    IsActive: false,
    OnlyMine: false
  }
  chart_label_color = ["#FF0000", "#0000FF", "#008000", "#5a2a36"];
  step: any = 0;
  tabSelected: any = 0;
  postData: any;
  pData: any;
  url: any;
  userDeatilInfo: any;
  showTable: boolean = false;
  GrandTotalExpanditure: any;
  AllExpanditure: any = [];
  returnResult: any = [];
  UtilityData: any = [];
  UtilityDataDetailView: any = [];
  LastFourItems: any = [];
  AllMonths: any = [];
  LastSixGrocery: any = [];
  AllItems: any = [];
  cMonthAllItems: any = [];
  AllGrocery: any = [];
  dtOptions: Config = {};
  MasterData = {
    Water: { Quantity: 0 },
    Electric: { Unit: 0 },
    Rent: { Amount: 0.00 },
    TargetAmount: { Amount: 0.00 }
  };
  private incrementIntervals: any[] = [];

  constructor(
    private httpcall: HttpCallService
  ) {
    var userDetail = localStorage.getItem('userDeatil');
    this.userDeatilInfo = userDetail ? JSON.parse(userDetail) : {};

  }
  ngOnInit() {
    this.postData = {};
    this.pData = {
      showActiveOnly: false
    }
    this.url = environment.urlApiMaster + 'GetAllMonths';
    this.httpcall.httpPost(this.url, this.pData).subscribe({
      next: (v) => {
        if (v.length > 0) {
          this.AllMonths = v;
          const activeMonths = this.AllMonths.filter(month => month.IsCurrent);
          this.record.currentMonthID = activeMonths.length > 0 ? activeMonths[0].ID : null;
          //------
          this.url = environment.urlApiItem + 'GetItemsIndividualUserWise';

          this.httpcall.httpPost(this.url, this.postData).subscribe({
            next: (v) => {
              if (v.length > 0) {
                this.step = 1;
                this.AllExpanditure = v;
                let GrandTotalExpanditure = 0;
                const seriesData: number[] = [];
                const labelsData: string[] = [];

                this.AllExpanditure.forEach((element: Expenditure, index: number) => {
                  GrandTotalExpanditure += element.TotalExpenditure;
                  element.color = this.chart_label_color[index]
                });
                this.AllExpanditure.forEach((element: Expenditure) => {
                  let percentage = (element.TotalExpenditure / GrandTotalExpanditure) * 100;
                  seriesData.push(percentage);
                  labelsData.push(element.UserName);
                });

                this.GrandTotalExpanditure = GrandTotalExpanditure;
                this.initializeChart(seriesData, labelsData);

                // this.AllExpanditure.forEach((element: Expenditure) => {
                //   GrandTotalExpanditure += element.TotalExpenditure;
                //   seriesData.push(element.TotalExpenditure);
                //   labelsData.push(element.UserName);
                // });

                // this.GrandTotalExpanditure = GrandTotalExpanditure;
                // this.initializeChart(seriesData, labelsData);

                this.postData = {
                  LoginRoleID: 0,
                  showActiveOnly: false
                };
                this.url = environment.urlApiDashboard + 'GetUtilityDataForDashboard';

                this.httpcall.httpPost(this.url, this.postData).subscribe({
                  next: (d) => {
                    if (d != undefined && d.Data) {
                      this.UtilityData = d.Data;

                      const finalValues = {
                        Water: this.UtilityData.Water?.[0]?.Quantity || 0,
                        Electric: this.UtilityData.Electric?.[0]?.Unit || 0,
                        Rent: this.UtilityData.Rent?.[0]?.Amount || 0,
                        TargetAmount: this.UtilityData.TargetAmount?.[0]?.Amount || 0
                      };

                      this.animateValue("Water", "Quantity", finalValues.Water);
                      this.animateValue("Electric", "Unit", finalValues.Electric);
                      this.animateValue("Rent", "Amount", finalValues.Rent);
                      this.animateValue("TargetAmount", "Amount", finalValues.TargetAmount);
                    }
                    //--
                    this.postData = {
                      LoginRoleID: 0,
                      showActiveOnly: false
                    };
                    this.url = environment.urlApiItem + 'GetAllItems';

                    this.httpcall.httpPost(this.url, this.postData).subscribe({
                      next: (t) => {
                        this.AllItems = t;
                        let fourItem = this.AllItems.filter(item => item.MonthID == this.record.currentMonthID);
                        this.LastFourItems = fourItem
                          .sort((a, b) => b.ID - a.ID)
                          .slice(0, 4);
                      },
                      error: (e) => {
                        console.error(e);
                      },
                      complete: () => { },
                    });
                    //--
                    this.postData = {
                      LoginRoleID: 0,
                      showActiveOnly: false
                    };
                    this.url = environment.urlApiUtility + 'GetAllGrocery';

                    this.httpcall.httpPost(this.url, this.postData).subscribe({
                      next: (t) => {
                        this.AllGrocery = t;
                        this.LastSixGrocery = this.AllGrocery
                          .sort((a, b) => b.ID - a.ID)
                          .slice(0, 6);
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
              } else {
                this.AllExpanditure = [];
              }
            },
            error: (e) => {
              console.error(e);
            },
            complete: () => { },
          });

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

  animateValue(category: string, field: string, finalValue: number) {
    let currentValue = 0;
    const duration = 1000; // Animation duration in milliseconds
    const speed = 200; // Update speed (ms)
    const step = Math.ceil(finalValue / (duration / speed));

    const interval = setInterval(() => {
      if (currentValue >= finalValue) {
        this.MasterData[category][field] = finalValue;
        clearInterval(interval);
      } else {
        this.MasterData[category][field] = currentValue;
        currentValue += step;
      }
    }, speed);

    this.incrementIntervals.push(interval);
  }
  onChangeFilter() {
    this.returnResult = [];
  }
  onClickViewAllUtility() {
    this.step = 2;
    this.UtilityDataDetailView = [];
    //--
    this.postData = {
      LoginRoleID: 0,
      showActiveOnly: false
    };
    this.url = environment.urlApiUtility + 'GetAllWater';

    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (w) => {
        var allWaterList = w;
        this.UtilityDataDetailView.Water = allWaterList.filter(month => month.MonthID == this.record.currentMonthID);
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => { },
    });
    //--
    this.url = environment.urlApiUtility + 'GetAllRent';

    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (r) => {
        this.UtilityDataDetailView.Rent = r;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => { },
    });
    //--
    this.url = environment.urlApiUtility + 'GetAllElectric';

    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (el) => {
        this.UtilityDataDetailView.Electric = el;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => { },
    });
    //--
    this.url = environment.urlApiMaster + 'GetAllTargetAmount';

    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (e) => {
        this.UtilityDataDetailView.TargetAmount = e;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => { },
    });
  }

  onClickViewAllItems() {
    this.cMonthAllItems = this.AllItems.filter(item => item.MonthID == this.record.currentMonthID);
    this.step = 3;
  }
  onClickViewAllGrocery() {
    this.step = 4;
  }
  onClickBackDashboard() {
    this.step = 1;
    this.UtilityDataDetailView = [];
    this.cMonthAllItems = [];
    this.tabSelected = 0;
  }
  onTabChange(d: any) {
    this.tabSelected = d;
  }

  onClickView() {
    this.postData = {
      UserID: this.record.showOnlyMine ? (this.userDeatilInfo.UserID != undefined ? this.userDeatilInfo.UserID : 0) : 0,
      TransactionTypeID: 0,
      MonthID: this.record.MonthID != undefined ? this.record.MonthID : 0
    }
    var endPoint = this.record.OnlyMine == true ? 'GetItemsMonthUserWise' : 'GetItemsMonthWise';
    this.url = environment.urlApiItem + endPoint;
    this.httpcall.httpPost(this.url, this.postData).subscribe({
      next: (v) => {
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

  initializeChart(seriesData: number[], labelsData: string[]) {
    this.chartOptions = {
      series: seriesData,
      chart: {
        height: 200, // Chart height
        width: 170,  // Chart width
        type: "radialBar",
        offsetY: 10,
        offsetX: -65
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 270,
          hollow: {
            size: "40%", // Thickness of the bar
          },
          track: {
            strokeWidth: '40%', // Thickness of the track
          },
          dataLabels: {
            name: {
              show: false, // Hide the name label
            },
            value: {
              show: false, // Hide the value label
            },
          },
        },
      },
      labels: labelsData, // Labels are still bound, but not displayed
      // colors: ["#FF0000", "#0000FF", "#008000", "#5a2a36"],// Custom colors
      colors: this.chart_label_color,
      legend: {
        show: false, // Hide the legend (optional)
      },
      responsive: [
        {
          breakpoint: 480, // Adjustments for mobile view
          options: {
            chart: {
              height: 320,
              width: 280,
            },
          },
        },
      ],
    };
  }
  ngAfterViewChecked() {
    if (!this.scrollContainer) {
      return;
    }


    const container = this.scrollContainer.nativeElement;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    container.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
    });

    container.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Adjust speed
      container.scrollLeft = scrollLeft - walk;
    });
  }
  ngOnDestroy() {
    this.incrementIntervals.forEach(interval => clearInterval(interval));
  }
}
