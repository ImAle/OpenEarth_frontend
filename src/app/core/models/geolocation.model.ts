export class Geolocation{
  latitude: string;
  longitude: string;
  displayName: string;

  constructor(latitude: string, longitude: string, displayName: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.displayName = displayName;
  }
}
