import {Component, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {HousePreview} from '../../core/models/housePreview.model';
import {CurrencyPipe} from '@angular/common';
import {GalleriaModule} from 'primeng/galleria';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-house-popup',
  imports: [
    RouterLink,
    CurrencyPipe,
    GalleriaModule
  ],
  templateUrl: './house-popup.component.html',
  styleUrl: './house-popup.component.css'
})
export class HousePopupComponent implements OnInit {
  @Input() house!: HousePreview;
  galleryImages: any[] = [];

  ngOnInit(): void {
    if (this.house?.pictures) {
      this.galleryImages = this.house.pictures.map((url: string) => ({
        itemImageSrc: url
      }));
    }
  }

  getImageUrl(url: string){
    return environment.rootUrl + url;
  }

  navigateToHouseDetails(){
    window.location.href = `/house/${this.house.id}`;
  }

}
