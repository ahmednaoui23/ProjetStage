import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ArticleService, Article, ArticlesResponse } from '../services/articles.service';
import { ViewEncapsulation } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-articles',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  displayedColumns: string[] = [
    'article',
    'code',
    'couleur',
    'sousFamille',
    'famille',
    'grille',
    'saisiPar',
    'saison',
    'select',
  ];

  selection = new SelectionModel<Article>(true, []);

  page = 1;
  totalPages = 1;
  loading = false;
  searchTerm = '';

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading = true;
    this.articleService.getArticles(this.page).subscribe({
      next: (data: ArticlesResponse) => {
        this.articles = data.articles;
        this.totalPages = data.total_pages;
        this.selection.clear();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading articles', err);
        this.loading = false;
      },
    });
  }

  applyFilter(event: any): void {
    const value = event.target.value.trim();
    this.searchTerm = value;
    this.page = 1; // reset page when filter changes

    if (!value) {
      this.loadArticles(); // normal paginated list
    } else {
      this.loading = true;
      this.articleService.searchArticles(value, this.page).subscribe({
        next: (data: ArticlesResponse) => {
          this.articles = data.articles;
          this.totalPages = data.total_pages;
          this.selection.clear();
          this.loading = false;
        },
        error: (err) => {
          console.error('Search error', err);
          this.articles = [];
          this.loading = false;
        },
      });
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;

      if (this.searchTerm) {
        this.loading = true;
        this.articleService.searchArticles(this.searchTerm, this.page).subscribe({
          next: (data: ArticlesResponse) => {
            this.articles = data.articles;
            this.totalPages = data.total_pages;
            this.selection.clear();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      } else {
        this.loadArticles();
      }
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;

      if (this.searchTerm) {
        this.loading = true;
        this.articleService.searchArticles(this.searchTerm, this.page).subscribe({
          next: (data: ArticlesResponse) => {
            this.articles = data.articles;
            this.totalPages = data.total_pages;
            this.selection.clear();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      } else {
        this.loadArticles();
      }
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.articles.length;
    return numSelected === numRows && numRows > 0;
  }

  isPartialSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.articles.length;
    return numSelected > 0 && numSelected < numRows;
  }

  masterToggle(event: any): void {
    if (event.checked) {
      this.selection.select(...this.articles);
    } else {
      this.selection.clear();
    }
  }

  toggleSelection(article: Article): void {
    this.selection.toggle(article);
  }
}
