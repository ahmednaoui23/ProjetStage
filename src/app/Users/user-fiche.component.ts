import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../services/user'

@Component({
  selector: 'app-user-fiche',
  templateUrl: './user-fiche.component.html',
})
export class UserFicheComponent {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
}
