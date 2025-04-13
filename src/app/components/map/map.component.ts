import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {GeolocationService} from '../../core/services/geolocation.service';
import {HouseService} from '../../core/services/house.service';
import {HousePreview} from '../../core/models/housePreview.model';
import mapboxgl from 'mapbox-gl';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() isInteractive: boolean = true;
  @Input() coordsByUser: { latitude: number; longitude: number } | null = null;

  @Output() coords = new EventEmitter<{ lat: number; lng: number }>();
  @Output() addressSelected = new EventEmitter<string>();
  @Output() houseSelected = new EventEmitter<HousePreview>();

  private mapToken = environment.map;
  private map!: mapboxgl.Map;
  private currentMarker: mapboxgl.Marker | null = null;

  constructor(
    private geolocationService: GeolocationService,
    private houseService: HouseService
  ) {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.coordsByUser) {
      const { latitude, longitude } = this.coordsByUser;
      this.setView(latitude, longitude);
      this.updateSingleMarker(latitude, longitude);
    }
  }

  private initializeMap(): void {
    (mapboxgl as any).accessToken = this.mapToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-3.7038, 40.4168],
      zoom: 10,
    });

    this.map.on('load', () => {
      if (this.isInteractive) {
        this.map.on('click', this.onMapClick.bind(this));
      } else {
        this.loadAllHouses();
      }
    });
  }

  private onMapClick(event: mapboxgl.MapMouseEvent): void {
    const { lng, lat } = event.lngLat;
    this.setView(lat, lng);
    this.updateSingleMarker(lat, lng);
    this.coords.emit({ lat, lng });
    this.fetchAddress(lat, lng);
  }

  private setView(lat: number, lng: number, zoom: number = 15): void {
    if (this.map) {
      this.map.flyTo({ center: [lng, lat], zoom });
    }
  }

  private updateSingleMarker(lat: number, lng: number): void {
    if (this.currentMarker) {
      this.currentMarker.remove();
    }

    this.currentMarker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(this.map);
  }

  private fetchAddress(lat: number, lng: number): void {
    this.geolocationService.getLocationByCoords(lat, lng).subscribe({
      next: (location) => {
        const data = (location as any).address;
        const addressMap = new Map<string, string>(Object.entries(data));

        const addressParts = [
          addressMap.get('state'),
          addressMap.get('city'),
          addressMap.get('city_district'),
          addressMap.get('postcode'),
          addressMap.get('suburb'),
          addressMap.get('neighbourhood'),
          addressMap.get('road'),
        ];

        const direction = addressParts.filter(Boolean).join(', ');
        this.addressSelected.emit(direction);
      },
      error: (err) => console.error('Error: ' + err),
    });
  }

  private loadAllHouses(): void {
    this.houseService.getAll().subscribe({
      next: (response) => {
        const houses = response.houses;
        houses.forEach((house: HousePreview) => this.addHouseMarker(house));
      },
      error: (err) => console.error(err),
    });
  }

  private addHouseMarker(house: HousePreview): void {
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="max-width: 200px">
        <h3>${house.title}</h3>
        <p>${house.price}</p>
        <img src="${house.pictures?.[0] || ''}" style="width: 100%; margin-top: 5px;" />
      </div>
    `);

    new mapboxgl.Marker()
      .setLngLat([house.longitude, house.latitude])
      .setPopup(popup)
      .addTo(this.map)
      .getElement()
      .addEventListener('click', () => {
        this.houseSelected.emit(house);
      });
  }

}
