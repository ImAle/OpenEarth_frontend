export class HousePreview {
  id: number;
  title: string;
  country: string;
  location: string;
  coordinates: string;
  price: number;
  currency: string;
  pictures: string[];

  constructor(id: number, title: string, country: string, location: string, coordinates: string,
              price: number, currency: string, pictures: string[]) {
    this.id = id;
    this.title = title;
    this.country = country;
    this.location = location;
    this.coordinates = coordinates;
    this.price = price;
    this.currency = currency;
    this.pictures = pictures;
  }
}
