import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html'
})
export class ContactsComponent implements OnInit, OnDestroy {
  @Output() userSelected = new EventEmitter<User>();

  searchTerm: string = '';
  users: User[] = [];
  isLoading: boolean = false;
  selectedUser: User | null = null;
  showResults: boolean = false;

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.performSearch(term);
    });
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  onSearchChange() {
    this.selectedUser = null;
    this.showResults = true;
    this.searchSubject.next(this.searchTerm);
  }

  private performSearch(term: string) {
    if (term && term.length >= 3) {
      this.isLoading = true;
      this.userService.searchUsers(term).subscribe({
        next: (response: any) => {
          console.log('Response received:', response);

          if (response.data?.data) {
            this.users = response.data.data;
          } else if (response.data) {
            this.users = response.data;
          } else if (Array.isArray(response)) {
            this.users = response;
          } else {
            this.users = [];
          }

          console.log('Processed users:', this.users);
          this.showResults = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche des utilisateurs:', error);
          this.isLoading = false;
          this.users = [];
          this.showResults = false;
        }
      });
    } else {
      this.users = [];
      this.showResults = false;
    }
  }

  selectUser(user: User) {
    console.log('User selected:', user);
    this.selectedUser = user;
    this.searchTerm = `${user.firstName} ${user.lastName}`.trim();
    this.showResults = false;
    // Émettre l'utilisateur sélectionné vers le composant parent
    this.userSelected.emit(user);
  }

  clearSearch() {
    this.searchTerm = '';
    this.users = [];
    this.selectedUser = null;
    this.showResults = false;
  }

  getInitial(user: User): string {
    if (user.firstName && user.firstName.length > 0) {
      return user.firstName.charAt(0);
    }
    if (user.phoneNumber && user.phoneNumber.length > 0) {
      return user.phoneNumber.charAt(0);
    }
    return 'U';
  }

  getUserFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }
}
