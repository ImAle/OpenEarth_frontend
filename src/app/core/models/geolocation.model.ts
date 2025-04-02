export class Geolocation{
  latitude: string;
  longitude: string;
  location: string;

  constructor(latitude: string, longitude: string, location: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.location = location;
  }
}
