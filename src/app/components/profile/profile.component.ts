import { Component, OnInit } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { UserService } from '../../services/user.service';
import {User, UserRole} from '../../models/user.model';
import {BehaviorSubject, firstValueFrom} from 'rxjs';
import {ApiResponse} from '../../models/api-response.interface';
import {EditProfileComponent} from './edit-profile.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone:true,
  templateUrl: './profile.component.html',
  imports: [CommonModule, RouterModule, EditProfileComponent],
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

  logout() {
    this.router.navigate(['/login']);
  }
}
