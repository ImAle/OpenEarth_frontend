import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {House} from '../../core/models/house.model';
import {HouseService} from '../../core/services/house.service';
import {ActivatedRoute} from '@angular/router';
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
    ReviewComponent
  ],
  templateUrl: './home-details.component.html',
  styleUrl: './home-details.component.css',
  standalone: true
})
export class HomeDetailsComponent implements OnInit {
  private km: number = 25.0;
  coords: {latitude: number, longitude: number} = {latitude: 0, longitude: 0};
  house!: House;
  startDate: Date = new Date();
  endDate: Date = new Date();
  minEndDate: Date = new Date();
  tomorrow: Date = new Date();
  showDescriptionModal: boolean = false;
  nearbyHouses: HousePreview[] = [];

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

  constructor(
    private route: ActivatedRoute,
    private houseService: HouseService
  ) {}

  ngOnInit(): void {
    // Date initialization
    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    this.startDate = new Date(this.tomorrow);
    this.endDate = new Date(this.tomorrow);
    this.endDate.setDate(this.endDate.getDate() + 1);
    this.minEndDate = new Date(this.startDate);
    this.minEndDate.setDate(this.minEndDate.getDate() + 1);

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.getHouseDetails(Number(id));
    }
  }

  getHouseDetails(id: number) {
    this.houseService.getById(id).subscribe({
      next: (response: any) => {
        this.house = response.house;
        this.setupPictures();
        this.getNearbyHouses();

        this.coords = {
          latitude: this.house.latitude,
          longitude: this.house.longitude
        };
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  setupPictures() {
    this.pictures = this.house.pictures.map(pic => ({
      itemImageSrc: environment.rootUrl + pic.url,
      thumbnailImageSrc: environment.rootUrl + pic.url
    }));
  }

  getNearbyHouses() {
    if (this.house) {
      this.houseService.getHousesNearTo(this.house.id, this.km).subscribe({
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
    return this.house.price * this.getNights();
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
}
