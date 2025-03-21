import {Picture} from './picture.model';

export interface HouseUpdateForm{
  title: string;
  description: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  price: number;
  currency: string;
  category: string;
  status: string;
  pictures: Picture[];
}
