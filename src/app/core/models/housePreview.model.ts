export class HousePreview {
  id: number;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  price: number;
  currency: string;
  pictures: string[];

  constructor(id: number, title: string, location: string, latitude: number, longitude: number,
              guests: number, bedrooms: number, beds: number, bathrooms: number,
              price: number, currency: string, pictures: string[]) {
    this.id = id;
    this.title = title;
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.guests = guests;
    this.bedrooms = bedrooms;
    this.beds = beds;
    this.bathrooms = bathrooms;
    this.price = price;
    this.currency = currency;
    this.pictures = pictures;
  }
}
