import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FooterComponent
  ]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  searchTerm = '';
  protected readonly Math = Math;

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
    this.setupSearchSubscription();
  }

  private setupSearchSubscription() {
    this.searchUsers();
  }

  loadUsers(page: number = 1) {
    this.isLoading = true;
    this.currentPage = page;

    this.userService.listUsers()
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
          return of({ data: [], error: true, message: 'Erreur' });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (!response.error && response.data) {
          console.log('Données reçues:', response.data);
          this.users = response.data;
          this.totalItems = this.users.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.filterUsers();
        } else {
          console.error('Erreur dans la réponse:', response.message);
          this.users = [];
          this.totalItems = 0;
          this.totalPages = 0;
          this.filteredUsers = [];
        }
      });
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.applyPagination(this.users);
      return;
    }

    const search = this.searchTerm.toLowerCase();
    const filtered = this.users.filter(user =>
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phoneNumber?.includes(search)
    );

    this.applyPagination(filtered);
  }

  private applyPagination(users: User[]) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredUsers = users.slice(startIndex, endIndex);
    this.totalItems = users.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  searchUsers() {
    if (!this.searchTerm) {
      this.loadUsers(1);
      return;
    }

    this.isLoading = true;
    this.userService.searchUsers(this.searchTerm)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la recherche:', error);
          return of({ data: [], error: true, message: 'Erreur' });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (!response.error && response.data) {
          this.users = response.data;
          this.applyPagination(this.users);
        } else {
          this.users = [];
          this.applyPagination([]);
        }
      });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterUsers();
    }
  }

  editUser(user: User) {
    console.log('Éditer utilisateur:', user);
  }

  toggleUserStatus(user: User) {
    this.isLoading = true;
    const updatedUser = { ...user, isActive: !user.isActive };

    this.userService.updateUser(user.id, updatedUser)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la mise à jour du statut:', error);
          return of({ data: user, error: true, message: 'Erreur' });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (!response.error) {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = { ...this.users[index], isActive: !user.isActive };
            this.filterUsers();
          }
        }
      });
  }

  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems); // Correction ici
  }
}
