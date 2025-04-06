import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {HouseService} from '../../core/services/house.service';
import {CardComponent} from '../card/card.component';
import {HousePreview} from '../../core/models/housePreview.model';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    CardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  houses!: HousePreview[] | null;

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

  // funciona
  getCategories(){
    this.houseService.getCategories().subscribe({
      next: (response) => {
        if(response){
          console.log(response);
        }
      }, error: (err: Error) => {
        console.log(err);
      }
    });
  }

}
