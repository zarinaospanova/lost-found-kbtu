import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { ItemPost } from '../../interfaces/item-post';
import { filter } from 'rxjs';

@Component({
  selector: 'app-my-posts-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-posts-page.component.html',
  styleUrl: './my-posts-page.component.css',
})
export class MyPostsPageComponent implements OnInit {
  posts: ItemPost[] = [];
  errorMessage = '';

  constructor(
    private postService: PostService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadMyPosts();

    // 🔥 ФИКС
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.loadMyPosts();
    });
  }

  loadMyPosts(): void {
    this.postService.getMyPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load your posts';
      },
    });
  }
}
