import {Component, OnInit} from '@angular/core';
import {House} from '../../core/models/house.model';
import {HouseService} from '../../core/services/house.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home-details',
  imports: [],
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
      this.house = this.houseService.getById(id).subscribe({
        next: (response: any) => {
          this.house = response as House;
        }, error: (err : Error) => {
          console.log(err);
        }
      });
  }

}
