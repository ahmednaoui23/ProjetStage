import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService  } from '../../app/services/userservice';
import { FormsModule } from '@angular/forms';
import { User } from '../services/user'; // Adjust the import path as necessary

@Component({
  standalone: true,
  selector: 'app-user-fiche',
  templateUrl: './user-fiche.component.html',
  styleUrls: ['./user-fiche.component.css'],
  imports: [CommonModule, RouterModule, DatePipe, FormsModule]
})
export class UserFicheComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null;
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe(user => {
      this.user = user;
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe(updatedUser => {
        this.user = updatedUser;
        this.editMode = false;
      });
    }
  }

  deleteUser() {
    if (this.user && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.user.id).subscribe(() => {
        alert('User deleted');
        this.router.navigate(['/utilisateurs']);
      });
    }
  }

  resetPassword() {
    if (this.user && confirm('Reset this user\'s password?')) {
      this.userService.resetPassword(this.user.id as any).subscribe(() => {
        alert('Password reset successfully');
      });
    }
  }

  goBack() {
    this.router.navigate(['/utilisateurs']);
  }
}
