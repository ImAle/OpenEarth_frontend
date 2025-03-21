import {House} from './house.model';
import {Review} from './review.model';
import {Rent} from './rent.model';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  enabled: boolean;
  picture: string;
  houses: House[];
  rents: Rent[];
  reviews: Review[];
}
