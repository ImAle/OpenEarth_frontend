import {Component, OnInit} from '@angular/core';
import {HouseService} from '../../core/services/house.service';
import {NgClass} from '@angular/common';
import {
  faBed, faBoreHole, faBox, faBuildingColumns, faCampground, faCity, faEye, faGem,
  faHome, faMinus, faMountain, faPersonHiking, faPersonShelter, faPersonSwimming, faShip, faSkull, faSnowflake,
  faStar, faToriiGate, faTowerObservation, faTractor, faTree, faUmbrellaBeach, faVolleyball, faWarehouse,
  faWater, faWaterLadder, faWind
} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-filter',
  imports: [
    NgClass,
    FaIconComponent
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit{
  categories!: string[];
  minPrice: number|null = null;
  maxPrice: number|null = null;
  beds: number|null = null;
  guests: number|null = null;
  selectedCategory: string|null = null;

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

  onCategorySelected(event: Event) {
    //this.selectedCategory = event;
  }

  getCategories(){
    this.houseService.getCategories().subscribe({
      next: (response) => {
        if(response){
          this.categories = response.categories;
        }
      }, error: (err: Error) => {
        console.log(err);
      }
    });
  }

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || faHome;
  }

  scrollRight() {
    const container = document.getElementById('categoryScroll');
    if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
  }

  scrollLeft() {
    const container = document.getElementById('categoryScroll');
    if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
  }


}
