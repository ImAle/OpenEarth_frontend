import {Component} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {HouseService} from '../../core/services/house.service';
import {HomeCreationFormComponent} from '../home-creation-form/home-creation-form.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    HomeCreationFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private houseService: HouseService) {}

  // funciona
  getCategories(){
    console.log(this.houseService.getCategories().subscribe({
      next: (response) => {
        if(response){
          console.log(response);
        }
      }, error: (err: Error) => {
        console.log(err);
      }
    }
    ));
  }


}
