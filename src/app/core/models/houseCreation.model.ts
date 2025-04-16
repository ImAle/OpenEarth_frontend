export class HouseCreation {
  title: string;
  description: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  price: number;
  currency: string;
  location: string;
  category: string;
  latitude: number;
  longitude: number;

  constructor(title: string, description: string, guests: number, bedrooms: number, beds: number,
              bathrooms: number, price: number, currency: string, location: string, category: string,
              latitude: number, longitude: number) {
    this.title = title;
    this.description = description;
    this.guests = guests;
    this.bedrooms = bedrooms;
    this.beds = beds;
    this.bathrooms = bathrooms;
    this.price = price;
    this.currency = currency;
    this.location = location;
    this.category = category;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
