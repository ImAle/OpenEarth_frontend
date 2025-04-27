import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PaypalService} from '../../../core/services/paypal.service';
import {HeaderComponent} from '../../header/header.component';
import {Rent} from '../../../core/models/rent.model';
import {HouseService} from '../../../core/services/house.service';
import {House} from '../../../core/models/house.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-paypal-success',
  imports: [
    HeaderComponent,
    DatePipe
  ],
  templateUrl: './paypal-success.component.html',
  styleUrl: './paypal-success.component.css'
})
export class PaypalSuccessComponent implements OnInit{

  isLoading = true;
  isSuccess = false;
  paymentToken = '';
  errorMessage = '';
  rent: Rent | null = null;
  house: House | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paypalService: PaypalService,
    private houseService: HouseService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paymentToken = params['token'] || '';

      if (this.paymentToken) {
        this.confirmPayment();
      } else {
        this.isLoading = false;
        this.errorMessage = 'No valid token received. Please try again.';
      }
    });
  }

  confirmPayment(): void {
   this.paypalService.capturePayment(this.paymentToken).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.rent = response.rent;
        this.getHouseDatils();
      },
      error: (error) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.errorMessage = 'Server connection error. Please contact support.';
        console.error('Error confirming payment:', error);
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToReservations(): void {
    this.router.navigate(['/configuration']);
  }

  getHouseDatils(){
    this.houseService.getById(this.rent!.houseId, "EUR").subscribe({
      next: (response: any)=> {
        this.house = response.house;
      }, error: (error) => {
        console.error('Error fetching house details:', error);
      }
    })
  }
}
