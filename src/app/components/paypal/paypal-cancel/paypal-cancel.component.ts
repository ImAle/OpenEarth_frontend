import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import {HouseService} from '../../../core/services/house.service';

@Component({
  selector: 'app-paypal-cancel',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './paypal-cancel.component.html',
  styleUrls: ['./paypal-cancel.component.css']
})
export class PaypalCancelComponent implements OnInit {
  houseId: number | null = null;

  constructor(private router: Router, private houseService: HouseService) {}

  ngOnInit(): void {
    this.houseId = Number(sessionStorage.getItem('visitingHouse')) || null;
    console.log(this.houseId);
  }

  getCancelMessage(): string {
    return 'The payment process was not completed.';
  }

  getCancelDescription(): string {
    return `The booking for the property was not completed. No charge has been made to your account.`;
  }

  retryPayment(): void {
    if (this.houseId) {
      this.router.navigate(['/house', this.houseId]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
