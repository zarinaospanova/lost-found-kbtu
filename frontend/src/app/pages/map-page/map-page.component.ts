import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
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
    html: `<div class="custom-marker lost-marker"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  private foundIcon = L.divIcon({
    className: 'custom-marker-wrapper',
    html: `<div class="custom-marker found-marker"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  constructor(
    private postService: PostService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadData();
  }

  initMap(): void {
    this.map = L.map('map').setView([43.255596, 76.943159], 19);

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

      const popupHtml = `
        <div class="map-popup">
          <b>${post.title}</b><br>
          Type: ${post.item_type}<br>
          Status: ${post.status}<br>
          Category: ${post.category_name}<br>
          Location: ${post.building_name} - ${post.location_name}<br>
          <button class="popup-btn" id="post-${post.id}">
            Open Details
          </button>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: markerIcon })
        .addTo(this.map)
        .bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const button = document.getElementById(`post-${post.id}`);
        if (button) {
          button.addEventListener('click', () => {
            this.router.navigate(['/posts', post.id]);
          });
        }
      });
    });
  }
}
