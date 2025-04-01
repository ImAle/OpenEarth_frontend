import { Component } from '@angular/core';
import {HouseService} from '../../core/services/house.service';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  constructor(private houseService: HouseService) {}

  getHouses(){
    this.houseService.getAll().subscribe((data) => {})
  }
}
