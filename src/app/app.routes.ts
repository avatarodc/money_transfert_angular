import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DemandeComponent } from './components/auth/demande.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { DemandeListComponent } from './components/demande/demande.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: DemandeComponent },
  { path: 'demandelist', component: DemandeListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboardAdmin', component: DashboardAdminComponent, canActivate: [AuthGuard] },
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard] },
];
