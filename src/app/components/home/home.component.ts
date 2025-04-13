import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {HouseService} from '../../core/services/house.service';
import {CardComponent} from '../card/card.component';
import {HousePreview} from '../../core/models/housePreview.model';
import {MapComponent} from '../map/map.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {FilterComponent} from '../filter/filter.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    CardComponent,
    MapComponent,
    SearchBarComponent,
    FilterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  houses!: HousePreview[] | null;
  selectedHouse: HousePreview | null = null;

  ngOnInit(): void {
    this.getHouses();
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

  onHouseSelected(house: HousePreview) {
    this.selectedHouse = house;
  }

}
