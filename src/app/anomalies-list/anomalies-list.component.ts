import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Anomalie } from '../models/anomalie.model';
import { AnomalieService } from '../services/anomalies.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-anomalies-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './anomalies-list.component.html',
  styleUrls: ['./anomalies-list.component.css']
})
export class AnomaliesListComponent implements OnInit {
  anomalies: Anomalie[] = [];
  allAnomalies: Anomalie[] = []; // Liste complète pour la recherche locale
  displayedColumns: string[] = ['code_article', 'type', 'message', 'date'];
  page = 1;
  totalPages = 1;
  totalAnomalies = 0;
  loading = false;
  searchTerm = '';

  constructor(private anomalieService: AnomalieService) {}

  ngOnInit(): void {
    this.loadAnomalies();
  }

  loadAnomalies(): void {
    this.loading = true;
    this.anomalieService.getAnomalies(this.page).subscribe({
      next: data => {
        const anomaliesMapped = data.anomalies.map((a: any) => ({
          id: a.id,
          code_article: a.Code,
          type: a.Type,
          message: a.message,
          date: a.date_detection
        }));
        this.anomalies = anomaliesMapped;
        this.allAnomalies = anomaliesMapped; // sauvegarde originale pour reset
        this.totalPages = data.total_pages;
        this.totalAnomalies = data.total_anomalies;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur de chargement des anomalies', err);
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadAnomalies();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadAnomalies();
    }
  }

  applyFilter(event: any) {
    const value = event.target.value.trim();
    this.searchTerm = value;

    if (!value) {
      this.anomalies = [...this.allAnomalies]; // reset
    } else {
      this.anomalies = this.allAnomalies.filter(a =>
        a.code_article?.includes(value) ||
        a.type?.includes(value) ||
        a.message?.includes(value) ||
        a.date?.includes(value)
      );
    }
  }

  getTypeClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'Anomalie de prix':
        return 'badge badge-danger';
      case 'Code incorrecte':
        return 'badge badge-warning';
      default:
        return 'badge badge-info';
    }
  }
}
