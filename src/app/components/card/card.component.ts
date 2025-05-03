import {Component, Input, OnInit} from '@angular/core';
import {HousePreview} from '../../core/models/housePreview.model';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {GalleriaModule} from 'primeng/galleria';
import {environment} from '../../../environments/environment';
import {faUsers, faBed, faHome, faBath} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-card',
  imports: [
    FormsModule,
    CurrencyPipe,
    GalleriaModule,
    RouterLink,
    FaIconComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  @Input() house!: HousePreview;
  galleryImages: any[] = [];

  // Icons
  protected readonly faUsers = faUsers;
  protected readonly faHome = faHome;
  protected readonly faBed = faBed;
  protected readonly faBath = faBath;

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

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
}
