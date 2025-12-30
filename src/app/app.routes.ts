import { Routes } from '@angular/router';

//loadComponent: Lazzy Load
export const routes: Routes = [
  { path: '', loadComponent: () => import('../app/main-body/main-body.component').then((c) => c.MainBodyComponent), title: 'Home' },
  { path: 'quran/:PageNumber', loadComponent: () => import('../app/quran-page/quran-page.component').then((c) => c.QuranPageComponent), title: 'Quran Page' },
  { path: 'streams', loadComponent: () => import('../app/streams-page/streams-page.component').then((c) => c.StreamsPageComponent), title: 'Streams Page' },
  { path: 'about', loadComponent: () => import('../app/about/about.component').then((c) => c.AboutComponent), title: 'About' },
  { path: 'search', loadComponent: () => import('../app/search-page/search-page.component').then((c) => c.SearchPageComponent), title: 'Search' }
];
