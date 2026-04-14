import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PostService } from '../../services/post.service';
import { ItemPost } from '../../interfaces/item-post';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  total = 0;
  lostCount = 0;
  foundCount = 0;
  resolvedCount = 0;
  errorMessage = '';

  constructor(
    private postService: PostService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadStats();

    // 🔥 ФИКС: обновление при каждом заходе
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.loadStats();
    });
  }

  loadStats(): void {
    this.postService.getPosts().subscribe({
      next: (data: ItemPost[]) => {
        this.total = data.length;
        this.lostCount = data.filter((p) => p.item_type === 'lost').length;
        this.foundCount = data.filter((p) => p.item_type === 'found').length;
        this.resolvedCount = data.filter((p) => p.status === 'resolved').length;
      },
      error: () => {
        this.errorMessage = 'Failed to load stats';
      },
    });
  }
}
