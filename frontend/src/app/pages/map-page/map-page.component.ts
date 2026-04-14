import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { PostService } from '../../services/post.service';
import { LocationService } from '../../services/location.service';
import { ItemPost } from '../../interfaces/item-post';
import { Location } from '../../interfaces/location';

@Component({
  selector: 'app-map-page',
  standalone: true,
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.css'
})
export class MapPageComponent implements AfterViewInit {
  private map!: L.Map;
  posts: ItemPost[] = [];
  locations: Location[] = [];

  private lostIcon = L.divIcon({
    className: 'custom-marker-wrapper',
    html: '<div class="custom-marker lost-marker"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  private foundIcon = L.divIcon({
    className: 'custom-marker-wrapper',
    html: '<div class="custom-marker found-marker"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  constructor(
    private postService: PostService,
    private locationService: LocationService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadData();
  }

  initMap(): void {
    this.map = L.map('map').setView([43.2389, 76.8897], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  loadData(): void {
    this.locationService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations;

        this.postService.getPosts().subscribe({
          next: (posts) => {
            this.posts = posts;
            this.addMarkers();
          }
        });
      }
    });
  }

  addMarkers(): void {
    this.posts.forEach(post => {
      let lat: number | undefined;
      let lng: number | undefined;

      if (post.latitude != null && post.longitude != null) {
        lat = post.latitude;
        lng = post.longitude;
      } else {
        const location = this.locations.find(loc => loc.id === post.location);
        if (!location) return;

        lat = location.latitude;
        lng = location.longitude;
      }

      const markerIcon = post.item_type === 'lost' ? this.lostIcon : this.foundIcon;

      L.marker([lat, lng], { icon: markerIcon })
        .addTo(this.map)
        .bindPopup(`
          <b>${post.title}</b><br>
          Type: ${post.item_type}<br>
          Status: ${post.status}<br>
          Category: ${post.category_name}<br>
          Location: ${post.building_name} - ${post.location_name}<br>
          ${post.latitude != null && post.longitude != null ? 'Exact point selected' : 'Approximate location'}
        `);
    });
  }
}
