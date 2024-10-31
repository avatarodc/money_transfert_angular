import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { ContactGoogleService } from '../../services/contact-google.service';
import { Contact } from '../../models/contact.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html'
})
export class ContactsComponent implements OnInit {
  allContacts: Contact[] = [];
  displayedContacts: Contact[] = [];
  showAddContact = false;
  showSearch = false;
  searchTerm: string = '';
  newContact = {
    phone: '',
    nickname: ''
  };

  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  isImporting = false;
  importStats: {
    totalContacts: number;
    contactsWithEmail: number;
    matchedUsers: number;
    importedContacts: number;
    existingContacts: number;
  } | null = null;

  constructor(
    private contactService: ContactService,
    private contactGoogleService: ContactGoogleService
  ) {}

  ngOnInit() {
    this.loadContacts();
    this.handleGoogleAuthCallback();
  }

  private handleGoogleAuthCallback() {
    // Écouter le message de callback de Google Auth
    window.addEventListener('message', (event) => {
      if (event.data.type === 'google-auth-success' && event.data.code) {
        this.handleGoogleAuthSuccess(event.data.code);
      }
    });
  }

  private handleGoogleAuthSuccess(code: string) {
    this.startImport();
  }

  loadContacts() {
    this.contactService.getContacts().subscribe({
      next: (response) => {
        this.allContacts = response.data;
        this.filterAndPaginateContacts();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contacts:', error);
      }
    });
  }

  filterAndPaginateContacts() {
    let filteredContacts = this.allContacts;

    if (this.searchTerm && this.searchTerm.length >= 3) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredContacts = this.allContacts.filter(contact => {
        const nickname = contact.nickname?.toLowerCase() || '';
        return nickname.includes(searchLower);
      });
    }

    this.totalPages = Math.ceil(filteredContacts.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedContacts = filteredContacts.slice(start, end);
  }

  onSearch() {
    this.currentPage = 1;
    this.filterAndPaginateContacts();
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchTerm = '';
      this.filterAndPaginateContacts();
    }
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.filterAndPaginateContacts();
    }
  }

  addContact() {
    this.contactService.createContactByPhone(
      this.newContact.phone,
      this.newContact.nickname
    ).subscribe({
      next: () => {
        this.loadContacts();
        this.showAddContact = false;
        this.newContact = { phone: '', nickname: '' };
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du contact:', error);
      }
    });
  }

  editContact(contact: Contact) {
    const nickname = prompt('Nouveau surnom:', contact.nickname || '');
    if (nickname !== null) {
      this.contactService.updateContact(contact.id, nickname).subscribe({
        next: () => {
          this.loadContacts();
        },
        error: (error) => {
          console.error('Erreur lors de la modification du contact:', error);
        }
      });
    }
  }

  deleteContact(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          this.loadContacts();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du contact:', error);
        }
      });
    }
  }

  importGoogleContacts() {
    this.isImporting = true;
    this.contactGoogleService.getGoogleAuthUrl().subscribe({
      next: (response) => {
        if (response.data && response.data.url) {
          window.open(
            response.data.url,  // Ici on accède correctement à l'URL
            'googleAuth',
            'width=500,height=600,scrollbars=yes'
          );
        }
        this.isImporting = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'URL:', error);
        this.isImporting = false;
      }
    });
  }

  private startImport() {
    this.contactGoogleService.importGoogleContacts().subscribe({
      next: (response) => {
        if (response.success) {
          this.importStats = response.data;
          this.loadContacts();
        } else {
          console.error('Erreur lors de l\'import des contacts:', response.message);
        }
        this.isImporting = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'import des contacts:', error);
        this.isImporting = false;
      }
    });
  }

  closeImportStats() {
    this.importStats = null;
  }

  get totalItems(): number {
    if (this.searchTerm && this.searchTerm.length >= 3) {
      return this.displayedContacts.length * this.totalPages;
    }
    return this.allContacts.length;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}
