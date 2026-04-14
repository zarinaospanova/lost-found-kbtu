import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { PostsPageComponent } from './pages/posts-page/posts-page.component';
import { PostDetailPageComponent } from './pages/post-detail-page/post-detail-page.component';
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { MyPostsPageComponent } from './pages/my-posts-page/my-posts-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'posts', component: PostsPageComponent },
  { path: 'posts/:id', component: PostDetailPageComponent },
  { path: 'create', component: CreatePostPageComponent, canActivate: [authGuard] },
  { path: 'my-posts', component: MyPostsPageComponent, canActivate: [authGuard] },
  { path: 'map', component: MapPageComponent },
];
