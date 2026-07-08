    import { Routes,RouterModule } from '@angular/router';
    import { LoginComponent } from './auth/login/login.component';
    import { LogoutComponent } from './auth/logout/logout.component';
    import { ErrorComponent } from './auth/error/error.component';
    import { DashboardComponent } from './components/dashboard/dashboard.component';

    export const routes: Routes = [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', title: 'Fundbook : LogIn', component: LoginComponent },
        { path: 'logout', title: 'Fundbook : Logout', component: LogoutComponent },
        { path: 'error', title: 'Fundbook : Error', component: ErrorComponent },
        //{ path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
        { path: 'dashboard', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), },

        // {
        //     path: 'dashboard', title: 'Fundbook : Administration', component: DashboardComponent,
        //     children: []
        // }
    ];
