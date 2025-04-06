import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {GeolocationService} from '../../core/services/geolocation.service';
import * as L from 'leaflet';
import {HouseService} from '../../core/services/house.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() isInteractive: boolean = true; // true by default
  @Input() coordsByUser: {latitude: number, longitude: number} | null = null;
  @Output() addressSelected = new EventEmitter<string>();
  private map!: L.Map;
  private marker!: L.Marker | null;

  private icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


  constructor(private geolocationService: GeolocationService, private houseService: HouseService) {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.coordsByUser){
      let lat: number = this.coordsByUser.latitude;
      let lng: number = this.coordsByUser.longitude;
      this.setView(lat, lng);
      this.updateMarker(lat, lng);
    }
  }

  private initializeMap(){
    // Initialize map on Madrid View
    this.map = L.map("map").setView([40.4168, -3.7038], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {attribution: "© OpenStreetMap contributors"})
      .addTo(this.map);

    if(this.isInteractive){
      this.map.on('click', this.onMapClick.bind(this));
    }else{
      this.addHouseToMap();
    }

  }

  updateMarker(lat: number, lng: number){
    if(this.marker){
      this.map.removeLayer(this.marker);
    }

    const icon = this.icon;
    this.marker = L.marker([lat, lng], {icon}).addTo(this.map);
  }

  onMapClick(event: any){
    const { lat, lng } = event.latlng;
    this.setView(lat, lng);

    this.updateMarker(lat, lng);
    this.getLocationByCoords(lat, lng);
  }

  setView(lat: number, lng: number){
    if(this.map){
      this.map.setView([lat, lng], 85);
    }
  }

  getLocationByCoords(lat: number, lng: number){
    this.geolocationService.getLocationByCoords(lat, lng).subscribe({
      next: (location) => {
        const data = (location as any).address;
        const addressMap = new Map<string, string>(Object.entries(data));

        const addressParts = [
          addressMap.get("state"),
          addressMap.get("city"),
          addressMap.get("city_district"),
          addressMap.get("postcode"),
          addressMap.get("suburb"),
          addressMap.get("neighbourhood"),
          addressMap.get("road"),
        ];

        const direction = addressParts.filter(Boolean).join(", ");
        this.addressSelected.emit(direction);
      },error: (err) => {
        console.error("Error: " + err);
      }
    })
  }

  addHouseToMap(){
    //this.houseService.getAll().subscribe()
  }

}
