import {Component, OnInit, AfterViewInit, ViewChild, OnDestroy, effect} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HouseService } from '../../core/services/house.service';
import { CardComponent } from '../card/card.component';
import { HousePreview } from '../../core/models/housePreview.model';
import { MapComponent } from '../map/map.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FilterComponent } from '../filter/filter.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {CurrencyComponent} from '../currency/currency.component';
import {CurrencyService} from '../../core/services/currency.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    CardComponent,
    MapComponent,
    SearchBarComponent,
    FilterComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  houses!: HousePreview[] | null;
  showMap: boolean = false;
  private housesSubscription!: Subscription;

  currentFilters = {
    location: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    beds: null as number | null,
    guests: null as number | null,
    category: null as string | null
  };

  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild(FilterComponent) filterComponent!: FilterComponent;
  @ViewChild(SearchBarComponent) searchBarComponent!: SearchBarComponent;
  @ViewChild(CurrencyComponent) currencyComponent!: CurrencyComponent;

  ngOnInit(): void {
    this.getHouses();

    // Suscribe to filtered houses
    this.housesSubscription = this.houseService.filteredHouses$.subscribe(
      (filteredHouses) => {
        if (filteredHouses) {
          this.houses = filteredHouses;
        }
      }
    );

  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => this.getTopOffset());
  }

  ngOnDestroy(): void {
    // avoid memory leaks
    if (this.housesSubscription) {
      this.housesSubscription.unsubscribe();
    }
    window.removeEventListener('resize', () => this.getTopOffset());
  }

  constructor(private houseService: HouseService, private currencyService: CurrencyService) {
    effect(() => {
      // Get the current currency from the store signal
      const currency = this.currencyService.current();
      // Refetch houses with the new currency
      if (currency) {
        this.fetchHousesWithFilters();
      }
    });
  }

  getHouses() {
    this.fetchHousesWithFilters();
  }

  onLocationSearch(location: string) {
    this.currentFilters.location = location;
    this.fetchHousesWithFilters();
  }

  onFiltersChanged(filters: {
    minPrice: number | null,
    maxPrice: number | null,
    beds: number | null,
    guests: number | null,
    category: string | null,
  }) {
    this.currentFilters.minPrice = filters.minPrice;
    this.currentFilters.maxPrice = filters.maxPrice;
    this.currentFilters.beds = filters.beds;
    this.currentFilters.guests = filters.guests;
    this.currentFilters.category = filters.category;
    this.fetchHousesWithFilters();
  }

  fetchHousesWithFilters() {
    const { location, minPrice, maxPrice, beds, guests, category } = this.currentFilters;

    const currency = this.currencyService.current().code;

    this.houseService.getAll(location || null, minPrice, maxPrice, beds, guests, category || null, currency).subscribe({
      next: (response) => {
        if(response && response.houses)
          this.houses = response.houses;
        else this.houses = null;
      }, error: (err: Error) => {
        console.log(err);
      }
    });
  }

  toggleView() {
    this.showMap = !this.showMap;

    // Prevent scrolling when map is shown
    if (this.showMap) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        this.mapComponent?.forceResize();
      }, 300);
    } else {
      document.body.style.overflow = '';
    }
  }

  getTopOffset(): number {
    return 8.5 * window.innerHeight / 100 + 65 + 60;
  }
}
