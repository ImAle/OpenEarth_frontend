import {Component} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {SelectButton} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {UserCreation} from '../../core/models/userCreation.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    HeaderComponent,
    FloatLabel,
    InputText,
    SelectButton
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  roles: any[] = [{label: 'Guest', value:'GUEST'}, {label: 'Hostess', value:'HOSTESS'}];
  pickedRole: string = 'GUEST';
  username!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  confirmation!: string;

  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
  }

  register(){
    const user = new UserCreation(this.username, this.firstName,
      this.lastName, this.email, this.password, this.confirmation,
      this.pickedRole);

    this.authService.register(user).subscribe({
      next: (response) => {
        if(response && response.token){
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
