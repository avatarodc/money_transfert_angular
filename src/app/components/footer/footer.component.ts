import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    DashboardComponent
  ],
  templateUrl: './footer.component.html',
  // styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(public apiService: ApiService, private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}
