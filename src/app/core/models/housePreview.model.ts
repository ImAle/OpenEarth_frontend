export class HousePreview {
  id: number;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: string;
  pictures: string[];

  constructor(id: number, title: string, location: string, latitude: number, longitude: number,
              price: number, currency: string, pictures: string[]) {
    this.id = id;
    this.title = title;
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.price = price;
    this.currency = currency;
    this.pictures = pictures;
  }
}
