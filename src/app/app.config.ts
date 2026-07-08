import { ApplicationConfig, provideZoneChangeDetection, NgModule, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';

import { routes } from './app.routes';
import { loaderInterceptor } from './shared/interceptor/loader-interceptor.service';
import { LoaderService } from './shared/services/loader.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LoaderComponent } from './shared/loader/loader.component';
import { NumberOnlyDirective  } from './shared/directives/number-only.directive';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), 
    provideHttpClient(withInterceptors([loaderInterceptor])),
    provideHttpClient(),
    provideAnimationsAsync(),
    HttpClient,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClient,
    LoaderService,
    LoaderComponent,
    NgApexchartsModule,
    NumberOnlyDirective 
  ]
};
