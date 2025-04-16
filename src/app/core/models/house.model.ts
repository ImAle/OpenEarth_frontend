import {Review} from './review.model';
import {UserInfoModel} from './userInfo.model';

export class House{
  id: number;
  title: string;
  description: string;
  guests: number;
  beds: number;
  bathrooms: number;
  price: number;
  currency: string;
  location: string;
  latitude: number;
  longitude: number;
  category: string;
  status: string;
  creationDate: string;
  pictures: string[];
  owner: UserInfoModel;
  reviews: Review[];

  constructor(id: number, title: string, description: string, guests: number, beds: number,
              bathrooms: number, price: number, currency: string, location: string, latitude: number, longitude: number,
              category: string, status: string, creationDate: string, pictures: string[], owner: UserInfoModel, reviews: Review[]) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.guests = guests;
    this.beds = beds;
    this.bathrooms = bathrooms;
    this.price = price;
    this.currency = currency;
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.category = category;
    this.status = status;
    this.creationDate = creationDate;
    this.pictures = pictures;
    this.owner = owner;
    this.reviews = reviews;
  }
}
