import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseService } from '../../core/services/house.service';
import {
  faBed, faBoreHole, faBox, faBuildingColumns, faCampground, faCity, faEye, faGem,
  faHome, faMinus, faMountain, faPersonHiking, faPersonShelter, faPersonSwimming, faShip, faSkull, faSnowflake,
  faStar, faToriiGate, faTowerObservation, faTractor, faTree, faUmbrellaBeach, faVolleyball, faWarehouse,
  faWater, faWaterLadder, faWind
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  categories: string[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  beds: number | null = null;
  guests: number | null = null;
  selectedCategory: string | null = null;
  showFiltersMenu: boolean = false;

  minSliderValue: number = 0;
  maxSliderValue: number = 250;
  maxPriceLimit: number = 500;
  minThumbPercent: number = 0;
  maxThumbPercent: number = 50;

  @Output() filtersChanged = new EventEmitter<{
    minPrice: number | null;
    maxPrice: number | null;
    beds: number | null;
    guests: number | null;
    category: string | null;
  }>();

  categoryIcons: { [key: string]: any } = {
    FARM: faTractor,
    COUNTRYSIDE: faPersonHiking,
    BEACH: faUmbrellaBeach,
    LAKE: faWater,
    CITY: faCity,
    CABINS: faHome,
    ISLANDS: faPersonSwimming,
    MANSIONS: faBuildingColumns,
    TREEHOUSES: faTree,
    TROPICAL: faVolleyball,
    LUXE: faGem,
    AMAZING_VIEWS: faEye,
    AMAZING_POOLS: faWaterLadder,
    TINY_HOMES: faPersonShelter,
    CAVES: faBoreHole,
    ARCTIC: faSnowflake,
    BARNS: faWarehouse,
    MINSUS: faMinus,
    CAMPING: faCampground,
    RYOKANS: faToriiGate,
    NEW: faStar,
    NATIONAL_PARKS: faMountain,
    ROOMS: faBed,
    BOATS: faShip,
    DESERT: faSkull,
    WINDMILLS: faWind,
    TOWERS: faTowerObservation,
    CONTAINERS: faBox
  };

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.houseService.getCategories().subscribe({
      next: (response) => {
        if (response) {
          this.categories = response.categories;
        }
      }, error: (err: Error) => {
        console.log(err);
      }
    });
  }

  getCategoryIcon(category: string): any {
    return this.categoryIcons[category] || faHome;
  }

  toggleCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
    }
    this.fetchHouses();
  }

  scrollRight() {
    const container = document.getElementById('categoryScroll');
    if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
  }

  scrollLeft() {
    const container = document.getElementById('categoryScroll');
    if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
  }

  toggleFiltersMenu() {
    this.showFiltersMenu = !this.showFiltersMenu;

    // Initialize los sliders with default values
    if (this.showFiltersMenu) {
      this.minSliderValue = this.minPrice || 0;
      this.maxSliderValue = this.maxPrice || this.maxPriceLimit / 2;
      this.updateSliderPercentages();
    }

    // Close menu when we click outside it
    if (this.showFiltersMenu) {
      setTimeout(() => {
        const closeOnClickOutside = (event: MouseEvent) => {
          const filterMenu = document.querySelector('.filters-menu');
          const filterButton = document.querySelector('.btn-outline-primary');
          if (filterMenu && !filterMenu.contains(event.target as Node) &&
            filterButton && !filterButton.contains(event.target as Node)) {
            this.showFiltersMenu = false;
            document.removeEventListener('click', closeOnClickOutside);
          }
        };
        document.addEventListener('click', closeOnClickOutside);
      }, 100);
    }
  }

  updateFromMinSlider() {
    if (this.minSliderValue > this.maxSliderValue) {
      this.minSliderValue = this.maxSliderValue;
    }
    this.minPrice = this.minSliderValue;
    this.updateSliderPercentages();
  }

  updateFromMaxSlider() {
    if (this.maxSliderValue < this.minSliderValue) {
      this.maxSliderValue = this.minSliderValue;
    }
    this.maxPrice = this.maxSliderValue;
    this.updateSliderPercentages();
  }

  updatePriceInputs() {
    if (this.minPrice !== null && this.maxPrice !== null && this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice;
    }

    if (this.minPrice !== null) {
      this.minSliderValue = this.minPrice;
    }
    if (this.maxPrice !== null) {
      this.maxSliderValue = this.maxPrice;
    }

    this.updateSliderPercentages();
  }

  // Calculate % for slider visualization
  updateSliderPercentages() {
    this.minThumbPercent = (this.minSliderValue / this.maxPriceLimit) * 100;
    this.maxThumbPercent = (this.maxSliderValue / this.maxPriceLimit) * 100;
  }

  incrementBeds() {
    this.beds = (this.beds || 0) + 1;
  }

  decrementBeds() {
    if (this.beds && this.beds > 1) {
      this.beds--;
    } else if (this.beds === null) {
      this.beds = 1;
    }
  }

  incrementGuests() {
    this.guests = (this.guests || 0) + 1;
  }

  decrementGuests() {
    if (this.guests && this.guests > 1) {
      this.guests--;
    } else if (this.guests === null) {
      this.guests = 1;
    }
  }

  validateBeds() {
    if (this.beds !== null && this.beds < 1) {
      this.beds = 1;
    }
  }

  validateGuests() {
    if (this.guests !== null && this.guests < 1) {
      this.guests = 1;
    }
  }

  clearAllFilters() {
    this.minPrice = null;
    this.maxPrice = null;
    this.beds = null;
    this.guests = null;
    this.minSliderValue = 0;
    this.maxSliderValue = this.maxPriceLimit / 2;
    this.updateSliderPercentages();
  }

  applyFilters() {
    this.fetchHouses();
    this.showFiltersMenu = false;
  }

  fetchHouses() {
    // const minPrice: number | null = this.minPrice !== null ? this.minPrice : null;
    // const maxPrice: number | null = this.maxPrice !== null ? this.maxPrice : null;
    // const beds: number | null = this.beds !== null ? this.beds : null;
    // const guests: number | null = this.guests !== null ? this.guests : null;
    // const category: string | null = this.selectedCategory || null;

    this.filtersChanged.emit({
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      beds: this.beds,
      guests: this.guests,
      category: this.selectedCategory
    });
  }

  isAnyFilterActive(): boolean {
    return this.minPrice !== null ||
      this.maxPrice !== null ||
      this.beds !== null ||
      this.guests !== null;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.minPrice !== null || this.maxPrice !== null) count++;
    if (this.beds !== null) count++;
    if (this.guests !== null) count++;
    return count;
  }

  formatCategoryName(category: string): string {
    const formattedName = category.replace(/_/g, ' ');
    const words = formattedName.split(' ');

    if (words.length > 1) {
      return words.join('\n');
    }

    return formattedName;
  }
}
