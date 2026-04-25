import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  username = '';
  email = '';
  password = '';
  password2 = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(form: NgForm): void {
    this.errorMessage = '';

    if (form.invalid) {
      return;
    }

    if (this.password !== this.password2) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      password2: this.password2,
    }).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: (err) => {
        if (err.error) {
          const messages = Object.values(err.error).flat() as string[];
          this.errorMessage = messages.join(' ');
        } else {
          this.errorMessage = 'Registration failed';
        }
      },
    });
  }
}
