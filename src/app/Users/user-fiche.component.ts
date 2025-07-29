import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/userservice';
import { User } from '../services/user';

@Component({
  selector: 'app-fiche-utilisateur',
  templateUrl: './user-fiche.component.html',
  styleUrls: ['./user-fiche.component.css']
  // Removed providers: [DatePipe]
})
export class FicheUtilisateurComponent implements OnInit {
  user: User | null = null;
  editMode = false;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId > 0) {
      this.loadUser(userId);
    } else {
      this.errorMessage = 'ID utilisateur invalide.';
      this.loading = false;
    }
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = this.mapUserResponse(data);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Échec du chargement des données utilisateur.';
        this.loading = false;
      }
    });
  }

  mapUserResponse(data: any): User {
    return {
      id: data.id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email,
      role: this.translateRole(data.role),
      address: data.address || '',
      phone: data.phoneNumber || '',
      status: data.status || '',
      createdAt: data.createdAt || '',
      lastLogin: data.lastLogin || '',
      profileImage: 'assets/profile-placeholder.png'
    };
  }

  get fullName(): string {
    if (!this.user) return '';
    return `${this.user.firstName} ${this.user.lastName}`.trim();
  }

  translateRole(role: string): string {
    const rolesMap: { [key: string]: string } = {
      Admin: 'Administrateur',
      User: 'Utilisateur',
      Moderator: 'Modérateur'
    };
    return rolesMap[role] || role;
  }

  reverseTranslateRole(frenchRole: string): string {
    const rolesMap: { [key: string]: string } = {
      'Administrateur': 'Admin',
      'Utilisateur': 'User',
      'Modérateur': 'Moderator'
    };
    return rolesMap[frenchRole] || frenchRole;
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.user) {
      this.loadUser(this.user.id);
    }
  }

  saveChanges(): void {
    if (!this.user) return;

    const updatedUser = {
      id: this.user.id,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      role: this.reverseTranslateRole(this.user.role),
      address: this.user.address,
      phoneNumber: this.user.phone,
      status: this.user.status
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        alert('Utilisateur mis à jour avec succès.');
        this.editMode = false;
        this.loadUser(this.user!.id);
      },
      error: () => {
        alert('Échec de la mise à jour de l\'utilisateur.');
      }
    });
  }

  deleteUser(): void {
    if (!this.user) return;

    const confirmed = confirm(`Voulez-vous vraiment supprimer l'utilisateur "${this.fullName}" ? Cette action est irréversible.`);
    if (confirmed) {
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          alert('Utilisateur supprimé avec succès.');
          this.router.navigate(['/users']);
        },
        error: () => {
          alert('Échec de la suppression de l\'utilisateur.');
        }
      });
    }
  }

  resetPassword(): void {
    if (!this.user) return;

    const confirmed = confirm(`Voulez-vous vraiment réinitialiser le mot de passe de "${this.fullName}" ?`);
    if (confirmed) {
      this.userService.resetPassword(this.user.id).subscribe({
        next: () => {
          alert('Mot de passe réinitialisé avec succès. Un nouvel email a été envoyé.');
        },
        error: () => {
          alert('Échec de la réinitialisation du mot de passe.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
