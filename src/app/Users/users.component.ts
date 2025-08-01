import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { UserService } from '../services/userservice'; // adjust path if needed
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';

interface UserDisplay {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  dateAjout: Date;
}

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
    MatDialogModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  searchTerm = '';
  loading = false;

  users: UserDisplay[] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'role', 'dateAjout'];
  page = 1;
  pageSize = 10;
  totalPages = 0;
  totalUsers = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.page, this.pageSize, this.searchTerm).subscribe({
      next: (data) => {
        this.users = data.users.map(u => ({
          id: u.id,
          nom: u.firstName,   // Fix: backend sends firstName → nom
          prenom: u.lastName,  // Fix: backend sends lastName → prenom
          email: u.email,
          role: u.role,
          dateAjout: u.createdAt ? new Date(u.createdAt.replace(' ', 'T')) : new Date()
        }));
        this.totalUsers = data.total;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
      }
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent);

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        // Instead of pushing locally, refetch users from backend to get real data (with ID etc.)
        this.page = 1; // optional: reset to first page after adding new user
        this.fetchUsers();
      }
    });
  }

  applyFilter(event: any): void {
    this.page = 1;
    this.searchTerm = event.target.value;
    this.fetchUsers();
  }

  goToProfile(userId: number): void {
    this.router.navigate(['/utilisateur-fiche', userId]);
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchUsers();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchUsers();
    }
  }
}
