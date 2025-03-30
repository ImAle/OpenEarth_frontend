export class HouseCreation {
  title: string;
  description: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  price: number;
  currency: string;
  country: string;
  location: string;
  category: string;

  constructor(title: string, description: string, guests: number, bedrooms: number, beds: number,
              bathrooms: number, price: number, currency: string, country: string, location: string, category: string) {
    this.title = title;
    this.description = description;
    this.guests = guests;
    this.bedrooms = bedrooms;
    this.beds = beds;
    this.bathrooms = bathrooms;
    this.price = price;
    this.currency = currency;
    this.country = country;
    this.location = location;
    this.category = category;
  }
}
