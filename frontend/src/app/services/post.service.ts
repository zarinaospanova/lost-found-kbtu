import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemPost } from '../interfaces/item-post';
import { CommentModel } from '../interfaces/comment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://127.0.0.1:8000/api/posts/';

  constructor(private http: HttpClient) {}

  getPosts(params: any = {}): Observable<ItemPost[]> {
    return this.http.get<ItemPost[]>(this.apiUrl, { params });
  }

  getPostById(id: number): Observable<ItemPost> {
    return this.http.get<ItemPost>(`${this.apiUrl}${id}/`);
  }

  getMyPosts(): Observable<ItemPost[]> {
    return this.http.get<ItemPost[]>(`${this.apiUrl}my/`);
  }

  createPost(data: FormData): Observable<ItemPost> {
    return this.http.post<ItemPost>(this.apiUrl, data);
  }

  patchPost(id: number, data: any): Observable<ItemPost> {
    return this.http.patch<ItemPost>(`${this.apiUrl}${id}/`, data);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  getComments(postId: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(`${this.apiUrl}${postId}/comments/`);
  }

  addComment(postId: number, message: string): Observable<CommentModel> {
    return this.http.post<CommentModel>(`${this.apiUrl}${postId}/comments/`, { message });
  }
}
