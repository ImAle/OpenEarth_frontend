import {Component, Input, OnInit} from '@angular/core';
import {HousePreview} from '../../core/models/housePreview.model';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {GalleriaModule} from 'primeng/galleria';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-card',
  imports: [
    FormsModule,
    CurrencyPipe,
    RouterLink,
    GalleriaModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  @Input() house!: HousePreview;
  galleryImages: any[] = [];

  constructor() {}

  ngOnInit(): void {
    if(this.house?.pictures){
      this.galleryImages = this.house.pictures.map((url: string) => ({
        itemImageSrc: url
      }));
    }
  }

  getImageUrl(url: string){
    return environment.rootUrl + url;
  }

}
