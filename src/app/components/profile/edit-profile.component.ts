import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UpdateUser } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';


interface ValidationErrors {
    [key: string]: string[];
}

@Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent {
  @Input() user!: User;
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<User>();
  profileForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  updating = false;
  validationErrors: ValidationErrors = {};

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
      this.initializeForm();
  }

  initializeForm() {
      this.profileForm = this.fb.group({
          firstName: [this.user.firstName, Validators.required],
          lastName: [this.user.lastName, Validators.required],
          email: [this.user.email, [Validators.required, Validators.email]],
          phoneNumber: [this.user.phoneNumber],
          address: [this.user.address],
          city: [this.user.city],
          country: [this.user.country],
          dateOfBirth: [this.user.dateOfBirth],
          currentPassword: ['', Validators.required],
          password: [''],
      });
  }

  onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = e => this.previewUrl = reader.result;
          reader.readAsDataURL(file);
      }
  }


// async onSubmit() {

//   // console.log('azerty')
//   // console.log('Validation Status:', this.profileForm.errors);
//   console.log('Errors:', this.profileForm.errors);
//   console.log('Form Values:', this.profileForm.value);


//       this.updating = true;
//       const formData = new FormData();
//       // console.log('azerty342')

//       // Add form fields to FormData
//       for (const key of Object.keys(this.profileForm.value)) {
//           if (key === 'password' && !this.profileForm.value[key]) {
//               continue; // ne pas ajouter si vide
//           }

//           formData.append(key, this.profileForm.value[key]);
//       }

//       // Add file if present
//       const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//       if (fileInput && fileInput.files && fileInput.files[0]) {
//           formData.append('photo', fileInput.files[0]);
//       }

//       try {
//           console.log('azerty')

//           // Use firstValueFrom to convert observable response to a promise
//           const response = await firstValueFrom(this.userService.updateProfile(this.user.id, formData));
//           console.log('azerty')

//           // Extract the user from ApiResponse and emit it
//           this.profileUpdated.emit(response.data);

//       } catch (error) {
//           if (error instanceof Error) {
//               this.validationErrors = (error as any).validationErrors || {};
//           } else {
//               console.error('Erreur lors de la mise à jour du profil:', error);
//           }
//       } finally {
//           this.updating = false;
//       }

// }

async onSubmit() {
  if (!this.profileForm.valid) {
      console.log('Form invalid:', this.profileForm.errors);
      return;
  }

  this.updating = true;
  const formData = new FormData();

  // Log des valeurs avant l'envoi
  console.log('Form values:', this.profileForm.value);

  // Ajouter les champs du formulaire
  const formFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'address',
      'city',
      'country',
      'dateOfBirth',
      'currentPassword'
  ];

  formFields.forEach(field => {
      const value = this.profileForm.get(field)?.value;
      if (value !== null && value !== undefined && value !== '') {
          formData.append(field, value);
          console.log(`Adding field ${field}:`, value); // Log chaque champ
      }
  });

  // Log du FormData
  formData.forEach((value, key) => {
      console.log('FormData entry:', key, value);
  });

  try {
      const response = await firstValueFrom(
          this.userService.updateProfile(this.user.id, formData)
      );
      console.log('Response:', response); // Log la réponse

      if (response.data) {
          this.profileUpdated.emit(response.data);
      }
  } catch (error: any) {
      console.error('Detailed error:', error);
      console.error('Error response:', error.error); // Log l'erreur complète

      if (error.status === 500) {
          this.validationErrors = {
              general: ['Une erreur serveur est survenue. Veuillez réessayer plus tard.']
          };
      } else if (error.error?.validationErrors) {
          this.validationErrors = error.error.validationErrors;
      } else {
          this.validationErrors = {
              general: ['Une erreur est survenue lors de la mise à jour du profil']
          };
      }
  } finally {
      this.updating = false;
  }
}
  cancel() {
      this.cancelEdit.emit();
  }
}
