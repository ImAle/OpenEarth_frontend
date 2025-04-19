import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {RouterLink} from '@angular/router';
import {CurrencyComponent} from '../currency/currency.component';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CurrencyComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isLoggedIn: boolean = false;
  role!: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
     let token: string | null = this.authService.getToken();
     if(token && token != 'Bearer null'){
       this.isLoggedIn = true;
       this.getRole();
     }
  }

  getRole(){
    this.authService.getRole().subscribe(response => {
      this.role = response.role;
    });
  }

  logout(){
    this.authService.logout();
  }
}
