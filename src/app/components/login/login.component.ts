import {Component, ElementRef, ViewChild} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {FloatLabelModule} from 'primeng/floatlabel';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../header/header.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    HeaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  @ViewChild("emailInput") emailInput!: ElementRef;
  @ViewChild("passwordInput") passwordInput!: ElementRef;
  errorMessage: string | null = null;

  constructor(private router: Router,private authService: AuthService) {}

  login(): void{
    this.authService.login(this.emailInput.nativeElement.value, this.passwordInput.nativeElement.value).subscribe({next: (response) => {
      if (response && response.token) {
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      }
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
      }
    });
  }
}
