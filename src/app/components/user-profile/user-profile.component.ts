import {Component, OnInit, ViewChild, ElementRef, AfterViewInit, effect} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { CardComponent } from '../card/card.component';
import { ReviewComponent } from '../review/review.component';
import { ReportComponent } from '../report/report.component';
import { UserService } from '../../core/services/user.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { HeaderComponent } from '../header/header.component';
import {Review} from '../../core/models/review.model';
import {HouseService} from '../../core/services/house.service';
import {House} from '../../core/models/house.model';
import {CurrencyService} from '../../core/services/currency.service';
import {HousePreview} from '../../core/models/housePreview.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ReviewComponent,
    ReportComponent,
    DialogModule,
    ButtonModule,
    Toast,
    HeaderComponent
  ],
  providers: [MessageService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  user!: User;
  houses!: HousePreview[];
  reviews!: Review[];
  showReportDialog = false;
  currentUserId!: number;
  currency!: string;

  // Scroll state variables
  canScrollHousesLeft = false;
  canScrollHousesRight = false;
  canScrollReviewsLeft = false;
  canScrollReviewsRight = false;

  // References to the scroll containers
  @ViewChild('housesContainer') housesContainer!: ElementRef;
  @ViewChild('reviewsContainer') reviewsContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private houseService: HouseService,
    private messageService: MessageService,
    private currencyService: CurrencyService,
  ) {
    effect(() => {
      // Get the current currency from the store signal
      const currency = this.currencyService.current().code;
      // Refetch houses with the new currency
      if (currency) {
        this.currency = currency;

        if(this.user)
          this.getHouses(this.user.id, currency);
      }
    });
  }

  ngOnInit(): void {
    const id = sessionStorage.getItem("id");

    if (id) {
      this.currentUserId = Number(id);
    }

    this.route.params.subscribe(params => {
      const userId = params['id'];

      this.userService.getUser(userId).subscribe(response => {
        this.user = response.user;
        this.getHouses(this.user.id, this.currency);
        this.reviews = this.user.reviews;

        // Check scroll status after data is loaded
        setTimeout(() => {
          this.checkHousesScroll();
          this.checkReviewsScroll();
        }, 100);
      });
    });
  }

  ngAfterViewInit() {
    // Check if scroll is needed after view is initialized
    setTimeout(() => {
      this.checkHousesScroll();
      this.checkReviewsScroll();
    }, 100);

    // Add resize listener to update arrows on window resize
    window.addEventListener('resize', () => {
      this.checkHousesScroll();
      this.checkReviewsScroll();
    });
  }

  getProfilePicUrl(): string {
    return this.user.picture ? environment.imgUrl + this.user.picture : environment.imgUrl + '/defaultUser.jpg';
  }

  getHouses(id: number, currency: string){
    this.houseService.getHousesByOwner(id, currency).subscribe({
      next: (response: any) => {
        this.houses = response.houses;
      }, error: (err) =>{
        console.log(err);
      }
    });
  }

  openChat(): void {
    console.log('Opening chat with user: ', this.user.id);
    this.router.navigate(['/chat', this.user.id]);
  }

  openReportDialog(): void {
    if(this.currentUserId != null) {
      this.showReportDialog = true;
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'You cannot perform this action!',
        detail: 'You must sign in to report.',
        key: 'err'
      });
    }
  }

  onReportSubmitted(): void {
    this.showReportDialog = false;
  }

  isHostess(): boolean {
    return this.user.role.toLowerCase() === 'hostess';
  }

  isGuest(): boolean {
    return this.user.role.toLowerCase() === 'guest';
  }

  isItMe(){
    return this.currentUserId === this.user.id;
  }

  // Scroll functions for houses container
  checkHousesScroll(): void {
    if (!this.housesContainer) return;

    const container = this.housesContainer.nativeElement;
    this.canScrollHousesLeft = container.scrollLeft > 0;
    this.canScrollHousesRight = container.scrollWidth > container.clientWidth + container.scrollLeft;
  }

  scrollHousesLeft(): void {
    const container = this.housesContainer.nativeElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollHousesRight(): void {
    const container = this.housesContainer.nativeElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // Scroll functions for reviews container
  checkReviewsScroll(): void {
    if (!this.reviewsContainer) return;

    const container = this.reviewsContainer.nativeElement;
    this.canScrollReviewsLeft = container.scrollLeft > 0;
    this.canScrollReviewsRight = container.scrollWidth > container.clientWidth + container.scrollLeft;
  }

  scrollReviewsLeft(): void {
    const container = this.reviewsContainer.nativeElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollReviewsRight(): void {
    const container = this.reviewsContainer.nativeElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

}
