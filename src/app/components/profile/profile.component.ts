import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] ,
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent
  ]
})
export class ProfileComponent {
  profileImage: string | null = null;
  userName: string | null = null;
  userEmail: string | null = null;
  dropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  help(): void {
    // Implémentez votre logique d'aide ici
    console.log('Aide demandée');
  }

  logout(): void {
    // Implémentez votre logique de déconnexion ici
    console.log('Déconnexion');
  }
}
