import {Component, ElementRef, ViewChild} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {FloatLabelModule} from 'primeng/floatlabel';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../header/header.component';
import {Router, RouterLink} from '@angular/router';
import {Checkbox} from 'primeng/checkbox';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    HeaderComponent,
    Checkbox,
    RouterLink,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  @ViewChild("emailInput") emailInput!: ElementRef;
  @ViewChild("passwordInput") passwordInput!: ElementRef;

  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) {}

  login(): void{
    this.authService.login(this.emailInput.nativeElement.value, this.passwordInput.nativeElement.value).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('id', response.id);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err);
        if(err.status == 403){
          this.sendEnabledError();
        }else{
          this.sendStandardError();
        }
      }
    });
  }

  sendEnabledError(){
    this.messageService.add({
      severity: "error",
      summary: "Access denied",
      detail: "Your account has been disabled.",
      key: 'err',
      life: 5000
    })
  }

  sendStandardError(){
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: "Email or password wrong.",
      key: 'err',
      life: 5000
    });
  }
}
