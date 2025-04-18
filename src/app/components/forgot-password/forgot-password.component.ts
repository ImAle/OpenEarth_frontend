import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  emailForm: FormGroup;
  resetForm: FormGroup;
  resetToken: string | null = null;
  isResetMode = false;
  emailSent = false;
  errorMessage = '';
  successMessage = '';
  loading = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      this.isResetMode = !!this.resetToken;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.isResetMode && this.resetToken) {
        this.authService.validateResetToken(this.resetToken).subscribe({
          next: () => {
            this.isResetMode = true;
          },
          error: (err) => {
            console.log(err);
            this.isResetMode = false;
            this.errorMessage = 'Invalid or expired password reset link. Please request a new one.';
          }
        });
      }
    });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onEmailSubmit(): void {
    if (this.emailForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const email = this.emailForm.get('email')?.value;

    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.loading = false;
        this.emailSent = true;
        this.successMessage = 'Password reset link sent to your email.';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Email not found. Please check and try again.';
      }
    });
  }

  onResetSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    if (this.resetForm.hasError('notMatching')) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const newPassword = this.resetForm.get('password')?.value;

    this.authService.resetPassword(this.resetToken!, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Password successfully reset. You can now log in with your new password.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
