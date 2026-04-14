import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { ItemPost } from '../../interfaces/item-post';
import { CommentModel } from '../../interfaces/comment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-detail-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-detail-page.component.html',
  styleUrl: './post-detail-page.component.css',
})
export class PostDetailPageComponent implements OnInit {
  post: ItemPost | null = null;
  comments: CommentModel[] = [];
  newComment = '';
  errorMessage = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Invalid post id';
      this.loading = false;
      return;
    }

    this.loadPost(id);
  }

  loadPost(id: number): void {
    this.loading = true;

    this.postService.getPostById(id).subscribe({
      next: (data) => {
        this.post = data;
        this.errorMessage = '';
        this.loading = false;

        this.loadComments(id);
      },
      error: () => {
        this.errorMessage = 'Failed to load post';
        this.loading = false;
      },
    });
  }

  loadComments(id: number): void {
    this.postService.getComments(id).subscribe({
      next: (data) => {
        this.comments = data;
      },
      error: () => {
        this.comments = [];
      },
    });
  }

  addComment(): void {
    if (!this.post || !this.newComment.trim()) return;

    this.postService.addComment(this.post.id, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments(this.post!.id);
      },
    });
  }

  markResolved(): void {
    if (!this.post) return;

    this.postService.patchPost(this.post.id, { status: 'resolved' }).subscribe({
      next: (updated) => {
        this.post = updated;
      },
    });
  }

  deletePost(): void {
    if (!this.post) return;

    this.postService.deletePost(this.post.id).subscribe({
      next: () => this.router.navigate(['/posts']),
    });
  }

  isOwner(): boolean {
    const user = this.authService.currentUser();
    return !!user && !!this.post && user.id === this.post.user;
  }
}
