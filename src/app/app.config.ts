// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AnomaliesListComponent } from './anomalies-list/anomalies-list.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // <-- Added FormsModule here
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
  withPreloading,
  PreloadAllModules
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { TokenInterceptor } from './interceptors/token_interceptor';

import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Register French locale data
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withViewTransitions(),
      withHashLocation()
    ),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    importProvidersFrom(
      SidebarModule,
      DropdownModule,
      CommonModule,
      ReactiveFormsModule,
      FormsModule,            // <-- Added here
      MatTableModule,
      MatProgressBarModule,
    ),
    IconSetService,
    provideAnimationsAsync(),

    // Set app locale to French
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    }
  ]
};
