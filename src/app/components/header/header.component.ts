import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  currentUser$ = new Observable<User | null>();
  dropdownOpen = false;
  profileImage = 'assets/images/default-profile.png'; // ou l'URL de votre image par défaut

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.currentUser$ = this.userService.getCurrentUser().pipe(
      map(response => response.data)
    );
  }

  ngOnInit() {
    // Plus besoin d'appeler getCurrentUser() ici car on utilise l'Observable du service
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
