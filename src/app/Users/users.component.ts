import { Component } from '@angular/core';
import { User } from '../services/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent {
  users: User[] = [
    { id: 1, name: 'Ahmed Naoui', email: 'ahmed@mail.com', role: 'Admin' },
    { id: 2, name: 'Sana Trabelsi', email: 'sana@mail.com', role: 'User' },
  ];

  selectedUser: User | null = null;

  addUser(user: User) {
    this.users.push({ ...user, id: Date.now() });
  }

  showUserFiche(user: User) {
    this.selectedUser = user;
  }

  closeFiche() {
    this.selectedUser = null;
  }
}
