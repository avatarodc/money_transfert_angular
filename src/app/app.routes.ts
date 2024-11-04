import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DemandeComponent } from './components/auth/demande.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { DemandeListComponent } from './components/demande/demande.component';

import { AuthGuard } from './guards/auth.guard';
import { TotalProfitComponent } from './components/total-profit/total-profit.component';
import { CreateAgentComponent } from './components/agent/create-agent/create-agent.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { AgentDashboardComponent } from './components/agent/agent-dashboard/agent-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: DemandeComponent },
  { path: 'demandelist', component: DemandeListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboardAdmin', component: DashboardAdminComponent, canActivate: [AuthGuard] },
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'total-profit', component: TotalProfitComponent, canActivate: [AuthGuard] },
  { path: 'create-agent', component: CreateAgentComponent, canActivate: [AuthGuard] },
  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'agent/dashboard', component: AgentDashboardComponent, canActivate: [AuthGuard] },
];
