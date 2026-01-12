import { Component, OnInit } from '@angular/core';
import { Aya, Surah, QuranPage } from '../Models/QuranPageModle';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import SurahListData from '../Mid/SurahList.json';
import AyaListData from '../Mid/AyaList.json';
import { CommonModule } from '@angular/common';
import { StringResource } from '../Resources/StringResource';

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-body.component.html',
  styleUrls: ['../app.component.css', './main-body.component.css']
})

export class MainBodyComponent implements OnInit {
  Strings = StringResource;
  AyasList: Aya[] = AyaListData as Aya[];
  SurahsList: Surah[] = SurahListData as Surah[];

  constructor(private router: Router) { }

  //Run on Strat
  ngOnInit() { }

  //Go to Quran Page by Juz
  gotoQuranPageByJuz(JuzNumber: number): void {
    let pageNr = Number(this.AyasList.filter(x => x.juz == String(JuzNumber))[0].page);
    this.router.navigate(['/quran', pageNr]);
  }

  //Go to Quran Page by Page
  gotoQuranPageByPage(PageNumber: number): void {
    this.router.navigate(['/quran', PageNumber]);
  }
}
