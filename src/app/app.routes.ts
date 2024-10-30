import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DemandeComponent } from './components/auth/demande.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import {DemandeListComponent} from './components/demande/demande-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'demande', component: DemandeComponent },
  { path: 'demandelist', component: DemandeListComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'dashboardAdmin', component: DashboardAdminComponent },


];
