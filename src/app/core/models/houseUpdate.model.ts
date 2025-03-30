export class HouseUpdate {
  title: string;
  description: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  price: number;
  currency: string;
  category: string;
  status: string;

  constructor(title: string, description: string, guests: number, bedrooms: number, beds: number,
              bathrooms: number, price: number, currency: string, category: string, status: string) {
    this.title = title;
    this.description = description;
    this.guests = guests;
    this.bedrooms = bedrooms;
    this.beds = beds;
    this.bathrooms = bathrooms;
    this.price = price;
    this.currency = currency;
    this.category = category;
    this.status = status;
  }
}
