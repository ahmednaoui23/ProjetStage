import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  searchTerm = '';
  loading = false;

  users = [
    {
      id: 1,
      nom: 'Naoui',
      prenom: 'Ahmed',
      email: 'ahmed@example.com',
      role: 'Admin',
      dateAjout: new Date(),
    },
    {
      id: 2,
      nom: 'Doe',
      prenom: 'Jane',
      email: 'jane@example.com',
      role: 'User',
      dateAjout: new Date(),
    },
  ];

  displayedColumns: string[] = ['nom', 'prenom', 'email', 'role', 'dateAjout'];
  page = 1;
  pageSize = 10;

  constructor(public router: Router) {}

  get filteredUsers() {
    const filtered = this.users.filter(user =>
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  totalPages = Math.ceil(this.users.length / this.pageSize);

  applyFilter(event: any) {
    this.page = 1; // reset to first page on filter
    this.searchTerm = event.target.value;
  }

  goToProfile(userId: number) {
    this.router.navigate(['/utilisateur-fiche', userId]);
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }
}
