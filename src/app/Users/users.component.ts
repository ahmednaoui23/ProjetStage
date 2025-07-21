import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  searchEmail = '';
  users = [
    {
      nom: 'Naoui',
      prenom: 'Ahmed',
      email: 'ahmed@example.com',
      role: 'Admin',
      datecreation: new Date(),
    },
    {
      nom: 'Doe',
      prenom: 'Jane',
      email: 'jane@example.com',
      role: 'User',
      datecreation: new Date(),
    },
  ];

  get filteredUsers() {
    return this.users.filter(user =>
      user.email.toLowerCase().includes(this.searchEmail.toLowerCase())
    );
  }

  constructor(public router: Router) {}

  search() {
    // Just triggers change detection for now
  }

  goToFiche(user: any) {
    console.log('Go to user:', user);
    // Example: navigate to user detail page with ID if available
    // this.router.navigate(['/user-detail', user.id]);
  }
}
