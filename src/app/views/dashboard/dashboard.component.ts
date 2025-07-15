import {NgStyle, CommonModule  } from '@angular/common';
import { Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { AnomaliesListComponent } from '../../anomalies-list/anomalies-list.component'; // Chemin à adapter selon ta structure
import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import {DashboardService} from '../../services/dashboard.service'
interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

interface Article {
  id: number;
  code: string;
  name: string;
  color: string;
  sousFamille: string;
  saison: string;
  grille?: string; // Optional property for grid
  saisiPar: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [
    WidgetsDropdownComponent,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ChartjsComponent,
    CommonModule,
    NgStyle,
    CardFooterComponent,
    GutterDirective,
    ProgressComponent,
    WidgetsBrandComponent,
    CardHeaderComponent,
    TableDirective,
    AnomaliesListComponent,
  ]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  readonly dashboardService = inject(DashboardService);

  public users: IUser[] = [];

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);

  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });

  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  showAddUserModal = false;

  // --------------------------
  // FILTER & PAGINATION PROPERTIES
  // --------------------------
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  paginatedArticles: Article[] = [];
  selectedArticleIds: number[] = [];

  filters = {
    color: '',
    sousFamille: '',
    saison: ''
  };

  uniqueColors: string[] = [];
  uniqueSousFamilles: string[] = [];
  uniqueSaisons: string[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  selectedFilterCategory: keyof typeof this.filters | '' = '';

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.fetchArticles(); // Load data from backend
  }

  initCharts(): void {
    this.mainChartRef()?.stop();
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }

  // --------------------------
  // FETCH DATA FROM BACKEND
  // --------------------------
  fetchArticles(): void {
    this.dashboardService.getArticles().subscribe({
      next: (data: Article[]) => {
        this.articles = data;

        this.extractColors();
        this.extractSousFamilles();
        this.extractSaisons();

        this.applyFilterAndPaginate();
      },
      error: (err) => {
        console.error('Error loading articles', err);
      }
    });
  }

  extractColors(): void {
    const setColors = new Set(this.articles.map(a => a.color));
    this.uniqueColors = Array.from(setColors);
  }

  extractSousFamilles(): void {
    const setSf = new Set(this.articles.map(a => a.sousFamille));
    this.uniqueSousFamilles = Array.from(setSf);
  }

  extractSaisons(): void {
    const setS = new Set(this.articles.map(a => a.saison));
    this.uniqueSaisons = Array.from(setS);
  }

  onFilterChange(filterName: keyof typeof this.filters, value: string) {
    this.filters[filterName] = value;
    this.currentPage = 1;
    this.applyFilterAndPaginate();
  }

  onFilterCategoryChange(category: keyof typeof this.filters | ''): void {
    this.selectedFilterCategory = category;

    this.filters.color = '';
    this.filters.sousFamille = '';
    this.filters.saison = '';

    if (category) {
      this.filteredArticles = this.articles.filter(article => {
        const val = article[category];
        return val !== null && val !== undefined && val.toString().trim() !== '';
      });
    } else {
      this.filteredArticles = [...this.articles];
    }

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredArticles.length / this.pageSize) || 1;
    this.paginatedArticles = this.filteredArticles.slice(0, this.pageSize);
  }

  applyFilterAndPaginate(): void {
    this.filteredArticles = this.articles.filter(a =>
      (this.filters.color ? a.color === this.filters.color : true) &&
      (this.filters.sousFamille ? a.sousFamille === this.filters.sousFamille : true) &&
      (this.filters.saison ? a.saison === this.filters.saison : true)
    );

    this.totalPages = Math.ceil(this.filteredArticles.length / this.pageSize) || 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedArticles = this.filteredArticles.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilterAndPaginate();
  }

  toggleSelection(id: number): void {
    const index = this.selectedArticleIds.indexOf(id);
    if (index > -1) {
      this.selectedArticleIds.splice(index, 1);
    } else {
      this.selectedArticleIds.push(id);
    }
  }

  toggleAll(checked: boolean): void {
    const idsOnPage = this.paginatedArticles.map(a => a.id);
    if (checked) {
      this.selectedArticleIds = Array.from(new Set([...this.selectedArticleIds, ...idsOnPage]));
    } else {
      this.selectedArticleIds = this.selectedArticleIds.filter(id => !idsOnPage.includes(id));
    }
  }

  verifySelected(): void {
    if (this.selectedArticleIds.length === 0) return;
    this.dashboardService.verifyAnomalies(this.selectedArticleIds).subscribe(res => {
      console.log('Anomalies detected:', res);
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilterAndPaginate();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPaginate();
    }
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }
}
