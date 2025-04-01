import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    // let token: string | null = this.authService.getToken();
    // if(token){
    //   this.isLoggedIn = true;
    // }
  }
}
