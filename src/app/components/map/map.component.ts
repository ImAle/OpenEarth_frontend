import {AfterViewInit, Component} from '@angular/core';
import {GeolocationService} from '../../core/services/geolocation.service';
import * as L from 'leaflet';
import {control} from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;

  constructor(private geolocationService: GeolocationService) {
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(){
    // Initialize map on Madrid View
    this.map = L.map("map").setView([40.4168, -3.7038], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {attribution: "© OpenStreetMap contributors"})
      .addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
  }

  onMapClick(event: any){
    const { lat, lng } = event.latlng;
    console.log("coords lat: " + lat + ", lng: " + lng);
  }

  setView(lat: number, lng: number){
    if(this.map){
      this.map.setView([lat, lng], 13);
    }
  }

}
