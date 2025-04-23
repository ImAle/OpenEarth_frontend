import {Review} from './review.model';
import {Rent} from './rent.model';
import {HousePreview} from './housePreview.model';

export class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  enabled: boolean;
  picture: string;
  houses: HousePreview[];
  rents: Rent[];
  reviews: Review[];
  creationDate : number;

  constructor(id: number, username: string, firstName: string, lastName: string, email: string,
              role: string, enabled: boolean, picture: string, houses: HousePreview[], rents: Rent[], reviews: Review[],
              creationDate: number) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
    this.enabled = enabled;
    this.picture = picture;
    this.houses = houses;
    this.rents = rents;
    this.reviews = reviews;
    this.creationDate = creationDate;

  }
}
