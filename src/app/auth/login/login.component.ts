import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, HttpClientModule],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.email.trim() || !this.password.trim()) {
      alert('Please enter your email and password.');
      return;
    }

    // Dummy login logic
    if (this.email === 'admin@example.com' && this.password === 'admin123') {
      localStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/views'], { replaceUrl: true });
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }
}
