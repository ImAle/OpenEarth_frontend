import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HouseService } from '../../core/services/house.service';
import { CardComponent } from '../card/card.component';
import { HousePreview } from '../../core/models/housePreview.model';
import { MapComponent } from '../map/map.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FilterComponent } from '../filter/filter.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

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

  @ViewChild(MapComponent) mapComponent!: MapComponent;

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

  constructor(private houseService: HouseService) {}

  getHouses() {
    this.houseService.getAll().subscribe({
      next: (response) => {
        //the house.service takes care
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
