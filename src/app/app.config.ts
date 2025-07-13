import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
    importProvidersFrom(SidebarModule, DropdownModule, CommonModule, ReactiveFormsModule),
    IconSetService,
    provideAnimationsAsync()
  ]
};
// Note: The `provideAnimationsAsync` is used to ensure that animations are loaded asynchronously.
// This is particularly useful for larger applications where you want to optimize the initial load time.  