import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserCreation } from '../../core/models/userCreation.model';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel'
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent,
    InputTextModule,
    SelectButtonModule,
    MessageModule,
    FloatLabelModule,
    NgClass,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  roles: any[] = [{ label: 'Guest', value: 'GUEST' }, { label: 'Hostess', value: 'HOSTESS' }];
  pickedRole: string = 'GUEST';
  username!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  confirmation!: string;

  usernameErrors = false;
  usernameErrorMessage = '';
  firstNameErrors = false;
  firstNameErrorMessage = '';
  lastNameErrors = false;
  lastNameErrorMessage = '';
  emailErrors = false;
  emailErrorMessage = '';
  passwordErrors = false;
  passwordErrorMessage = '';
  confirmationErrors = false;
  confirmationErrorMessage = '';
  roleErrors = false;
  roleErrorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  validateUsername(): void {
    this.usernameErrors = !this.username || this.username.length < 5 || this.username.length > 15;
    this.usernameErrorMessage = this.usernameErrors ? 'Username must be between 5 and 15 characters.' : '';
  }

  validateFirstName(): void {
    this.firstNameErrors = !this.firstName;
    this.firstNameErrorMessage = this.firstNameErrors ? 'First Name is required.' : '';
  }

  validateLastName(): void {
    this.lastNameErrors = !this.lastName;
    this.lastNameErrorMessage = this.lastNameErrors ? 'Last Name is required.' : '';
  }

  validateEmail(): void {
    this.emailErrors = !this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    this.emailErrorMessage = this.emailErrors ? 'Invalid email format.' : '';
  }

  validatePassword(): void {
    this.passwordErrors = !this.password || this.password.length < 8;
    this.passwordErrorMessage = this.passwordErrors ? 'Password must be at least 8 characters.' : '';
  }

  validateConfirmation(): void {
    this.confirmationErrors = !this.confirmation;
    this.confirmationErrorMessage = this.confirmationErrors ? 'Password Confirmation is required.' : '';
    if (!this.confirmationErrors && this.password !== this.confirmation) {
      this.confirmationErrors = true;
      this.confirmationErrorMessage = 'Passwords do not match.';
    }
  }

  validateRole(): void {
    this.roleErrors = !this.pickedRole;
    this.roleErrorMessage = this.roleErrors ? 'Please select a role.' : '';
  }

  register(): void {
    this.validateUsername();
    this.validateFirstName();
    this.validateLastName();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmation();
    this.validateRole();

    if (
      this.usernameErrors ||
      this.firstNameErrors ||
      this.lastNameErrors ||
      this.emailErrors ||
      this.passwordErrors ||
      this.confirmationErrors ||
      this.roleErrors
    ) {
      return;
    }

    const user = new UserCreation(
      this.username,
      this.firstName,
      this.lastName,
      this.email,
      this.password,
      this.confirmation,
      this.pickedRole
    );

    this.authService.register(user).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('id', response.id);
        sessionStorage.setItem('role', response.role);
        sessionStorage.setItem('username', response.username);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Registration Error:', err);
      },
    });
  }

  resetErrors(): void {
    this.usernameErrors = false;
    this.usernameErrorMessage = '';
    this.firstNameErrors = false;
    this.firstNameErrorMessage = '';
    this.lastNameErrors = false;
    this.lastNameErrorMessage = '';
    this.emailErrors = false;
    this.emailErrorMessage = '';
    this.passwordErrors = false;
    this.passwordErrorMessage = '';
    this.confirmationErrors = false;
    this.confirmationErrorMessage = '';
    this.roleErrors = false;
    this.roleErrorMessage = '';
  }
}
