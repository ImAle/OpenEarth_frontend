import {User} from './user.model';
import {Review} from './review.model';

export class House{
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
  pictures: string[];
  owner: User;
  reviews: Review[];

  constructor(id: number, title: string, description: string, guests: number, beds: number,
              bathrooms: number, price: number, currency: string, country: string, location: string, coordinates: string,
              category: string, status: string, creationDate: string, pictures: string[], owner: User, reviews: Review[]) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.guests = guests;
    this.beds = beds;
    this.bathrooms = bathrooms;
    this.price = price;
    this.currency = currency;
    this.country = country;
    this.location = location;
    this.coordinates = coordinates;
    this.category = category;
    this.status = status;
    this.creationDate = creationDate;
    this.pictures = pictures;
    this.owner = owner;
    this.reviews = reviews;
  }
}
