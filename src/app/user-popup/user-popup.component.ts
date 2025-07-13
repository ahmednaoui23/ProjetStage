import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authservice';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent {
  @Output() closePopup = new EventEmitter<void>();
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
submitForm() {
  if (this.userForm.valid) {
    const { username, email, password } = this.userForm.value;

    this.authService.register(username, email, password).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.userForm.reset();        // ✅ clear fields
          this.closePopup.emit();       // ✅ close popup
        } else {
          alert('Something went wrong.');
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Unexpected error';
        alert(msg);                    // ❌ Show error
      }
    });
  } else {
    alert('Please fill all required fields.');
  }
}
ngOnInit() {
  this.resetForm();
}

resetForm() {
  this.userForm.reset(); // ✅ this clears everything
}


  close() {
    this.userForm.reset(); // Optional: reset on cancel
    this.closePopup.emit();
  }
}
