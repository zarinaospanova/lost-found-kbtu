import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { ItemPost } from '../../interfaces/item-post';
import { filter } from 'rxjs';

@Component({
  selector: 'app-posts-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.css',
})
export class PostsPageComponent implements OnInit {
  posts: ItemPost[] = [];
  errorMessage = '';

  constructor(
    private postService: PostService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPosts();

    // 🔥 ФИКС: обновление при каждом заходе
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.loadPosts();
    });
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load posts';
      },
    });
  }
}
