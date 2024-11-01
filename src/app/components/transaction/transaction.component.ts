import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FooterComponent } from '../footer/footer.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-transaction',
  standalone: true,
  templateUrl: './transaction.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactsComponent,
    FooterComponent
  ]
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public apiService: ApiService
  ) {
    this.transactionForm = this.fb.group({
      recipient: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: [''],
    });
  }

  ngOnInit(): void {}

  onUserSelected(user: User) {
    // Mettre à jour le champ recipient avec le numéro de téléphone de l'utilisateur sélectionné
    this.transactionForm.patchValue({
      recipient: user.phoneNumber
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      console.log(this.transactionForm.value);
      setTimeout(() => this.isLoading = false, 1500);
    }
  }
}
