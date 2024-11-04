import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs/operators';
import { UserRole, KycStatus ,CreateUserRequest} from '../../../models/user.model';

@Component({
  selector: 'app-create-agent',
  templateUrl: './create-agent.component.html',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class CreateAgentComponent implements OnInit {
  agentForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.agentForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{4}$')
      ]],
      confirmPassword: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      address: [''],
      city: [''],
      country: ['']
    });

    // Validation du confirmPassword
    this.agentForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      if (this.agentForm.get('password')?.value !== this.agentForm.get('confirmPassword')?.value) {
        this.agentForm.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        this.agentForm.get('confirmPassword')?.setErrors(null);
      }
    });
  }

  onSubmit() {
    if (this.agentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.agentForm.value;

      const agentData: CreateUserRequest = {
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        dateOfBirth: new Date(formValue.dateOfBirth),
        address: formValue.address || undefined,
        city: formValue.city || undefined,
        country: formValue.country || undefined,
        phoneNumber: formValue.phoneNumber,
        password: formValue.password,
        role: 'AGENT',
        isVerified: false,
        isActive: false,
        kycStatus: 'PENDING',
        currency: 'FCFA',
        dailyLimit: 50000,
        monthlyLimit: 1000000
      };

      console.log('Données à envoyer:', agentData);

      this.userService.createAgent(agentData)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response) => {
            console.log('Réponse du serveur:', response);
            if (!response.error) {
              this.router.navigate(['/dashboard']);
            } else {
              this.errorMessage = response.message || 'Une erreur est survenue lors de la création de l\'agent';
            }
          },
          error: (error) => {
            console.error('Erreur détaillée:', error);
            let errorMessage = 'Une erreur est survenue lors de la création de l\'agent';

            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.status === 400) {
              errorMessage = 'Les données fournies sont invalides';
            } else if (error.status === 500) {
              errorMessage = 'Erreur interne du serveur';
            }

            this.errorMessage = errorMessage;
          }
        });
    } else {
      Object.keys(this.agentForm.controls).forEach(key => {
        const control = this.agentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.agentForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('email')) {
      return 'Email invalide';
    }
    if (control?.hasError('pattern') && controlName === 'password') {
      return 'Le code PIN doit être composé de 4 chiffres exactement';
    }
    if (control?.hasError('mismatch')) {
      return 'Les codes PIN ne correspondent pas';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.agentForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    // Si vous n'avez pas besoin d'initialisation supplémentaire,
    // vous pouvez laisser cette méthode vide
  }
}
