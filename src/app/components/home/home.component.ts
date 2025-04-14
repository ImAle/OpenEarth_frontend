import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {HouseService} from '../../core/services/house.service';
import {CardComponent} from '../card/card.component';
import {HousePreview} from '../../core/models/housePreview.model';
import {MapComponent} from '../map/map.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {FilterComponent} from '../filter/filter.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
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
export class HomeComponent implements OnInit, AfterViewInit {
  houses!: HousePreview[] | null;
  showMap: boolean = false;

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  ngOnInit(): void {
    this.getHouses();
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => this.getTopOffset());
  }

  constructor(private houseService: HouseService) {}

  getHouses() {
    this.houseService.getAll().subscribe({
      next: (response) => {
        this.houses = response.houses;
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
