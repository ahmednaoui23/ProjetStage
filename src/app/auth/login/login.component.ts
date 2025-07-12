import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authservice';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, HttpClientModule, CommonModule],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;  // <-- added loading flag

  constructor(
    private _auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email.trim() || !this.password.trim()) {
      alert('Please enter your email and password.');
      return;
    }

    this.loading = true;  // <-- start loading

    this._auth.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;  // <-- stop loading
        this.router.navigate(['/dashboard'], { replaceUrl: true }); // rediriger
      },
      error: (error) => {
        this.loading = false;  // <-- stop loading
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed';
        alert(this.errorMessage);
      }
    });
  }
}
