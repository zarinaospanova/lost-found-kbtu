import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { CategoryService } from '../../services/category.service';
import { LocationService } from '../../services/location.service';
import { PostService } from '../../services/post.service';
import { Category } from '../../interfaces/category';
import { Location } from '../../interfaces/location';

@Component({
  selector: 'app-create-post-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-post-page.component.html',
  styleUrl: './create-post-page.component.css',
})
export class CreatePostPageComponent implements OnInit, AfterViewInit {
  title = '';
  description = '';
  item_type: 'lost' | 'found' = 'lost';
  date_event = '';
  contact_info = '';
  category = '';
  location = '';

  latitude: number | null = null;
  longitude: number | null = null;

  categories: Category[] = [];
  locations: Location[] = [];

  successMessage = '';
  errorMessage = '';

  private map!: L.Map;
  private selectedMarker: L.Marker | null = null;

  constructor(
    private categoryService: CategoryService,
    private locationService: LocationService,
    private postService: PostService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
    });

    this.locationService.getLocations().subscribe({
      next: (data) => (this.locations = data),
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('create-map').setView([43.2389, 76.8897], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      this.latitude = Number(lat.toFixed(6));
      this.longitude = Number(lng.toFixed(6));

      if (this.selectedMarker) {
        this.map.removeLayer(this.selectedMarker);
      }

      this.selectedMarker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(`Selected point:<br>Lat: ${this.latitude}<br>Lng: ${this.longitude}`)
        .openPopup();
    });
  }

  createPost(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.postService
      .createPost({
        title: this.title,
        description: this.description,
        item_type: this.item_type,
        date_event: this.date_event,
        contact_info: this.contact_info,
        category: this.category,
        location: this.location,
        latitude: this.latitude,
        longitude: this.longitude,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Post created successfully';
          this.router.navigate(['/posts']);
        },
        error: () => {
          this.errorMessage = 'Failed to create post';
        },
      });
  }
}
