import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FooterComponent } from '../footer/footer.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { User } from '../../models/user.model';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';

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
  selectedUser: any = null;
  successfulTransaction: any = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private userService: UserService,
    public apiService: ApiService
  ) {
    this.transactionForm = this.fb.group({
      recipient: ['', Validators.required],
      senderWalletId: ['', Validators.required],
      receiverWalletId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]]
    });

    this.userService.getCurrentUser().subscribe(response => {
      const currentUser = response.data;
      if (currentUser && currentUser.wallets && currentUser.wallets.length > 0) {
        this.transactionForm.patchValue({
          senderWalletId: currentUser.wallets[0].id
        });
      }
    });
  }

  ngOnInit(): void {}

  onUserSelected(user: any) {
    this.selectedUser = user;
    this.transactionForm.patchValue({
      recipient: user.phoneNumber,
      receiverWalletId: user.wallets?.[0]?.id
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.isLoading = true;

      const transferData = {
        senderWalletId: this.transactionForm.get('senderWalletId')?.value,
        receiverWalletId: this.transactionForm.get('receiverWalletId')?.value,
        amount: Number(this.transactionForm.get('amount')?.value),
        currency: 'FCFA'
      };

      this.transactionService.createTransfer(transferData).subscribe({
        next: (response) => {
          console.log('Transaction réussie:', response);
          this.successfulTransaction = {
            recipient: this.selectedUser?.phoneNumber,
            amount: transferData.amount,
            description: this.transactionForm.get('description')?.value,
            createdAt: new Date()
          };
          this.transactionForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de la transaction:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
