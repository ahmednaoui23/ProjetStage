import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/userservice'; // Adjust path as needed

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class AddUserDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      address: [''],        // Added address control
      phoneNumber: [''],    // Added phone number control
    });
  }

  submit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      // Prepare payload keys to match backend API
      const payload = {
        firstName: formValue.nom,
        lastName: formValue.prenom,
        email: formValue.email,
        role: formValue.role,
        address: formValue.address,
        phoneNumber: formValue.phoneNumber,
      };

      this.userService.createUser(payload).subscribe({
        next: () => {
          this.dialogRef.close(true);  // Signal success
        },
        error: (error) => {
          console.error('Error creating user:', error);
          // You can add a snackbar or alert here for user feedback
        }
      });
    }
  }
}
