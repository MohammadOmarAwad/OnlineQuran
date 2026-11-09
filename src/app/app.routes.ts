import { Routes } from '@angular/router';
import { StringResource } from './core/resources/StringResource';

//loadComponent: Lazzy Load
export const routes: Routes = [
  { path: 'quran/:PageNumber', loadComponent: () => import('./features/quran-page/quran-page.component').then((c) => c.QuranPageComponent), title: StringResource.Header_QuranPage },
  { path: 'streams', loadComponent: () => import('./features/streams-page/streams-page.component').then((c) => c.StreamsPageComponent), title: StringResource.Header_StreamsPage },
  { path: 'about', loadComponent: () => import('./features/about/about.component').then((c) => c.AboutComponent), title: StringResource.Header_AboutPage },
  { path: 'search', loadComponent: () => import('./features/search-page/search-page.component').then((c) => c.SearchPageComponent), title: StringResource.Header_SearchPage },
  { path: 'prayTime', loadComponent: () => import('./features/pray-time/pray-time.component').then((c) => c.PrayTimeComponent), title: StringResource.Header_PrayTimePage },
  { path: 'masjids', loadComponent: () => import('./features/masjids/masjids.component').then((c) => c.MasjidsComponent), title: StringResource.Header_MasjidsPage },
  { path: '', loadComponent: () => import('./features/main-body/main-body.component').then((c) => c.MainBodyComponent), title: StringResource.Header_MainPage },

  { path: 'prayTime/:DeviceType', loadComponent: () => import('./features/pray-time/pray-time.component').then((c) => c.PrayTimeComponent), title: StringResource.Header_PrayTimePage },
  { path: ':DeviceType', loadComponent: () => import('./features/main-body/main-body.component').then((c) => c.MainBodyComponent), title: StringResource.Header_MainPage },
];
