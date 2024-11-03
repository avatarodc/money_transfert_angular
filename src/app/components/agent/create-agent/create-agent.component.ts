import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

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
  ],

  // styleUrls: ['./create-agent.component.css']
})
export class CreateAgentComponent implements OnInit {
  agentForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.agentForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.agentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Ajoutez ici votre logique pour créer l'agent
      console.log(this.agentForm.value);

      // Simuler un délai et rediriger
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
