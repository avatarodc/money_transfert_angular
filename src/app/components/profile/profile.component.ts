import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { EditProfileComponent } from './edit-profile.component';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import {BehaviorSubject, firstValueFrom} from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] ,
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    EditProfileComponent,
  ]
})


export class ProfileComponent implements OnInit {
  user: User | null = null;
  isEditMode = false;

  constructor(
    private router: Router,
    private userService: UserService // Injecter userService
  ) {}

  async ngOnInit() {
    // Récupère l'utilisateur courant via le service
    try {
      const userResponse = await firstValueFrom(this.userService.getCurrentUser());
      this.user = userResponse.data; // Extrayez l'utilisateur de `data`
    } catch (error) {
      console.error('Erreur lors de la récupération de l’utilisateur:', error);
      // Gérer l'erreur de récupération, comme rediriger vers la page de connexion
    }
  }


  getRoleBadgeClass(role: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (role) {
      case UserRole.ADMIN:
        return `${baseClasses} bg-red-100 text-red-800`;
      case UserRole.AGENT:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case UserRole.CLIENT:
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getKycStatusBadgeClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'VERIFIED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  onProfileUpdated(updatedUser: User) {
    this.user = updatedUser;
    this.isEditMode = false;
  }

  async logout() {
    this.userService.logout();
    // Effacer l'historique et rediriger vers login
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', '/login');
    };
    await this.router.navigate(['/login']);
  }
}
