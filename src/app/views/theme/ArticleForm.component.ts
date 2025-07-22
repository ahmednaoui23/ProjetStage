import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ArticleService } from '../../services/TestArticle.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './ArticleForm.component.html',
})
export class ArticleFormComponent {
  articleForm: FormGroup;
  verificationResult: any = null;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService
  ) {
    this.articleForm = this.fb.group({
      Article: ['', Validators.required],
      IDArticle: [123],
      Etat: [1, Validators.required],
      prixAchat: [null, Validators.required],
      PrixFac: [null, Validators.required],
      Famille: ['', Validators.required],
      SousFamille: ['', Validators.required],
      codeFamille: ['', Validators.required],
      Saison: ['', Validators.required],
      Ordre: ['00', Validators.required],
      couleur: ['', Validators.required],
      fournisseur: ['', Validators.required],
      Code: ['', Validators.required],
    });
  }

  genererCode() {
    const saisonValue = (this.articleForm.get('Saison')?.value || '').toLowerCase();
    const ordre = this.articleForm.get('Ordre')?.value || '00';
    const codeFam = this.articleForm.get('codeFamille')?.value || 'XX';

    let lettreSaison = 'X';
    if (saisonValue.includes('hiver')) {
      lettreSaison = 'H';
    } else if (saisonValue.includes('ete') || saisonValue.includes('été')) {
      lettreSaison = 'E';
    }

    const randomPart = Math.floor(Math.random() * 900 + 100); // 100–999
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A–Z

    const code = `${ordre}${lettreSaison}N${codeFam}${randomPart}${letter}`;
    this.articleForm.patchValue({ Code: code });
  }

  verifierArticle() {
    const articleData = this.articleForm.value;
    this.articleService.verifierArticle(articleData).subscribe({
      next: (res) => {
        // si le backend retourne une liste vide
        if (Array.isArray(res) && res.length === 0) {
          this.verificationResult = 'Aucune anomalie détectée';
        } else {
          this.verificationResult = res;
        }
      },
      error: (err) => {
        this.verificationResult = {
          error: 'Erreur lors de la vérification',
          details: err,
        };
      },
    });

  }

  isInvalid(controlName: string): boolean {
    const control = this.articleForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  isArray(value: any): boolean {
  return Array.isArray(value);
}
}
