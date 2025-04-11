import {Component, OnInit} from '@angular/core';
import {House} from '../../core/models/house.model';
import {HouseService} from '../../core/services/house.service';
import {ActivatedRoute} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-home-details',
  imports: [
    HeaderComponent,
    CurrencyPipe
  ],
  templateUrl: './home-details.component.html',
  styleUrl: './home-details.component.css'
})
export class HomeDetailsComponent implements OnInit {
  house!: House;

  constructor(private route: ActivatedRoute ,private houseService: HouseService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id){
      this.getHouseDetails(Number(id));
    }

  }

  getHouseDetails(id: number){
      this.houseService.getById(id).subscribe({
        next: (response: any) => {
          this.house = response.house;
        }, error: (err : Error) => {
          console.log(err);
        }
      });
  }

}
