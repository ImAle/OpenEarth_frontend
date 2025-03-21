import {User} from './user.model';
import {Picture} from './picture.model';
import {Review} from './review.model';

export interface House{
  id: number;
  title: string;
  description: string;
  guests: number;
  beds: number;
  bathrooms: number;
  price: number;
  currency: string;
  country: string;
  location: string;
  coordinates: string;
  category: string;
  status: string;
  creationDate: string;
  pictures: Picture[];
  owner: User;
  reviews: Review[];

}
