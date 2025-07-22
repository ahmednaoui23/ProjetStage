import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    address: '123 Main St, Tunis',
    phone: '+216 20 123 456',
    status: 'Active',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    createdAt: '2024-05-01T10:30:00Z',
    lastLogin: '2024-07-20T14:00:00Z'
  };

  constructor() {}

  getUserById(id: number): Observable<User> {
    // For now, return the mock user. Later connect to real API.
    return of(this.mockUser);
  }

  updateUser(user: User): Observable<User> {
    // Simulate updating user
    console.log('Updating user:', user);
    return of(user);
  }

  deleteUser(id: number): Observable<void> {
    console.log('Deleting user id:', id);
    return of(void 0);
  }

  resetPassword(id: number): Observable<void> {
    console.log('Resetting password for user id:', id);
    return of(void 0);
  }
}

