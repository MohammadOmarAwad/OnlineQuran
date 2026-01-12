import { Routes } from '@angular/router';
import { StringResource } from './Resources/StringResource';

//loadComponent: Lazzy Load
export const routes: Routes = [
  { path: '', loadComponent: () => import('../app/main-body/main-body.component').then((c) => c.MainBodyComponent), title: StringResource.Header_MainPage },
  { path: 'quran/:PageNumber', loadComponent: () => import('../app/quran-page/quran-page.component').then((c) => c.QuranPageComponent), title: StringResource.Header_QuranPage },
  { path: 'streams', loadComponent: () => import('../app/streams-page/streams-page.component').then((c) => c.StreamsPageComponent), title: StringResource.Header_StreamsPage },
  { path: 'about', loadComponent: () => import('../app/about/about.component').then((c) => c.AboutComponent), title: StringResource.Header_AboutPage },
  { path: 'search', loadComponent: () => import('../app/search-page/search-page.component').then((c) => c.SearchPageComponent), title: StringResource.Header_SearchPage },
  { path: 'prayTime', loadComponent: () => import('../app/pray-time/pray-time.component').then((c) => c.PrayTimeComponent), title: StringResource.Header_PrayTimePage },
  { path: 'masjids', loadComponent: () => import('../app/masjids/masjids.component').then((c) => c.MasjidsComponent), title: StringResource.Header_MasjidsPage }
];
