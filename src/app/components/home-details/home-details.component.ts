import {AfterViewInit, Component, effect, ElementRef, OnInit, ViewChild} from '@angular/core';
import {House} from '../../core/models/house.model';
import {HouseService} from '../../core/services/house.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {GalleriaModule} from 'primeng/galleria';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import {MapComponent} from '../map/map.component';
import {CardComponent} from '../card/card.component';
import {ReviewComponent} from '../review/review.component';
import {HousePreview} from '../../core/models/housePreview.model';
import {environment} from '../../../environments/environment';
import {CurrencyService} from '../../core/services/currency.service';
import {PaypalService} from '../../core/services/paypal.service';
import {RentCreation} from '../../core/models/rentCreation.model';
import {AuthService} from '../../core/services/auth.service';
import {RentService} from '../../core/services/rent.service';
import {Rent} from '../../core/models/rent.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBath, faBed, faHome, faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-details',
  imports: [
    HeaderComponent,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    GalleriaModule,
    CalendarModule,
    DialogModule,
    CommonModule,
    MapComponent,
    CardComponent,
    ReviewComponent,
    RouterLink,
    FaIconComponent
  ],
  templateUrl: './home-details.component.html',
  styleUrl: './home-details.component.css',
  standalone: true
})
export class HomeDetailsComponent implements OnInit, AfterViewInit {
  private km: number = 5.0;
  private idHouse!: number;
  userProfilePictureUrl: string = '/defaultUser.jpg';
  currency!: string;
  coords: {latitude: number, longitude: number} = {latitude: 0, longitude: 0};
  house!: House;
  startDate: Date = new Date();
  endDate: Date = new Date();
  minEndDate: Date = new Date();
  tomorrow: Date = new Date();
  showDescriptionModal: boolean = false;
  nearbyHouses: HousePreview[] = [];
  totalPrice: number = 0;
  amIguest: boolean = false;
  disabledDates: Date[] = [];
  isLoading: boolean = false;

  // Icons
  protected readonly faUsers = faUsers;
  protected readonly faHome = faHome;
  protected readonly faBed = faBed;
  protected readonly faBath = faBath;

  // Full screen image properties
  showFullScreenImage: boolean = false;
  currentFullScreenImage: any = null;
  currentImageIndex: number = 0;

  @ViewChild('nearbyHousesScroll') nearbyHousesScroll!: ElementRef;
  @ViewChild('reviewsScroll') reviewsScroll!: ElementRef;

  pictures: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(private route: ActivatedRoute, private houseService: HouseService,
              private currencyService: CurrencyService, private paypalService: PaypalService,
              private authService: AuthService, private rentService: RentService) {
    effect(() => {
      // Get the current currency from the store signal
      const currency = this.currencyService.current().code;
      // Refetch houses with the new currency
      if (currency) {
        this.currency = currency;
        this.getHouseDetails(this.idHouse, currency);
      }
    });
  }

  ngOnInit(): void {
    // Date initialization
    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    this.startDate = new Date(this.tomorrow);
    this.endDate = new Date(this.tomorrow);
    this.endDate.setDate(this.endDate.getDate() + 1);
    this.minEndDate = new Date(this.startDate);
    this.minEndDate.setDate(this.minEndDate.getDate() + 1);

    this.currency = this.currencyService.current().code;
    this.route.paramMap.subscribe(params => {
      this.idHouse = Number(params.get('id'));
      this.getHouseDetails(this.idHouse, this.currency);
      sessionStorage.setItem("visitingHouse", this.idHouse.toString());
    });

    this.getRole();
  }

  ngAfterViewInit(): void {
    this.coords = {
      latitude: this.house.latitude,
      longitude: this.house.longitude
    };
  }

  getHouseDetails(id: number, currency: string) {
    this.houseService.getById(id, currency).subscribe({
      next: (response: any) => {
        console.log(response);
        this.house = response.house;
        this.userProfilePictureUrl = response.house.owner.picture ? environment.imgUrl + response.house.owner.picture : '/defaultUser.jpg';
        this.setupPictures();
        this.getNearbyHouses();
        this.getRentsByHouse();
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  setupPictures() {
    this.pictures = this.house.pictures.map(pic => ({
      itemImageSrc: environment.imgUrl + pic.url,
      thumbnailImageSrc: environment.imgUrl + pic.url
    }));
  }

  getNearbyHouses() {
    if (this.house) {
      this.houseService.getHousesNearTo(this.house.id, this.km, this.currency).subscribe({
        next: (response: any) => {
          this.nearbyHouses = response.houses;
        },
        error: (err: Error) => {
          console.log(err);
        }
      });
    }
  }

  updateDates() {
    // Making sure endDate is at least one day after startDate
    this.minEndDate = new Date(this.startDate);
    this.minEndDate.setDate(this.minEndDate.getDate() + 1);

    if (this.endDate <= this.startDate) {
      this.endDate = new Date(this.minEndDate);
    }
  }

  getNights(): number {
    if (!this.startDate || !this.endDate) return 0;

    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getTotalPrice(): number {
    this.totalPrice = this.house.price * this.getNights();
    return this.totalPrice;
  }

  isValidReservation(): boolean {
    return this.getNights() > 0 && this.startDate >= this.tomorrow;
  }

  showFullDescription() {
    this.showDescriptionModal = true;
  }

  scrollNearbyHouses(direction: 'left' | 'right') {
    if (this.nearbyHousesScroll) {
      const scrollAmount = 300;
      if (direction === 'left') {
        this.nearbyHousesScroll.nativeElement.scrollLeft -= scrollAmount;
      } else {
        this.nearbyHousesScroll.nativeElement.scrollLeft += scrollAmount;
      }
    }
  }

  scrollReviews(direction: 'left' | 'right') {
    if (this.reviewsScroll) {
      const scrollAmount = 300;
      if (direction === 'left') {
        this.reviewsScroll.nativeElement.scrollLeft -= scrollAmount;
      } else {
        this.reviewsScroll.nativeElement.scrollLeft += scrollAmount;
      }
    }
  }

  // Full screen image handling methods
  displayFullScreen(item: any) {
    this.currentFullScreenImage = item;
    this.currentImageIndex = this.pictures.findIndex(pic => pic.itemImageSrc === item.itemImageSrc);
    this.showFullScreenImage = true;
  }

  navigateImages(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.pictures.length) % this.pictures.length;
    } else {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.pictures.length;
    }
    this.currentFullScreenImage = this.pictures[this.currentImageIndex];
  }

  rentHouse() {
    this.isLoading = true;
    this.paypalService.createPayment(this.totalPrice, this.currency, "renting " + this.house.title + " in " + this.house.location).subscribe({
      next: (response: any) => {
        console.log(response);
        const rent: RentCreation = new RentCreation(this.startDate, this.endDate, this.house.id);
        sessionStorage.setItem("rent", JSON.stringify(rent));

        window.location.href = response.message;
      },
      error: (err: Error) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  getRole(): void {
    this.authService.getRole().subscribe({
      next: (response) => {
        this.amIguest = response.role === 'GUEST';
      },
      error: (error) => {
        console.error('Error fetching user role:', error);
      }
    })
  }

  getRentsByHouse(){
    console.log("Getting rents by house: " + this.house.id);
    this.rentService.getRentsByHouse(this.house.id).subscribe({
      next: (response: any) => {
        this.setDisabledDatesFromRents(response.rents);
      },
      error: (error: any) => {
        console.log(error);
        console.error('Error fetching user role:', error);
      }
    });
  }

  setDisabledDatesFromRents(rents: Rent[]) {
    this.disabledDates = [];
    rents.forEach(r => {
      if(!r.cancelled){
        const start = new Date(r.startTime);
        const end = new Date(r.endTime);

        const currentDate = new Date(start);
        const endDateComparison = new Date(end);

        while (currentDate <= endDateComparison) {
          this.disabledDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
  }
}
