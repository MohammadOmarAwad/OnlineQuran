import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { QuranPageComponent } from './quran-page/quran-page.component';

//loadComponent: Lazzy Load
export const routes: Routes = [
  { path: '', loadComponent: () => import('../app/main-body/main-body.component').then((c) => c.MainBodyComponent), title: 'Home' },
  { path: 'quran/:PageNumber', loadComponent: () => import('../app/quran-page/quran-page.component').then((c) => c.QuranPageComponent), title: 'Quran Page' }
];
