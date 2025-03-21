import {Picture} from './picture.model';

export interface HousePreview {
  id: number;
  title: string;
  country: string;
  location: string;
  coordinates: string;
  price: number;
  currency: string;
  pictures: Picture[];

}
