import { Component, OnInit } from '@angular/core';
import { Aya, Surah, QuranPage } from '../Models/QuranPageModle';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import SurahListData from '../Mid/SurahList.json';
import AyaListData from '../Mid/AyaList.json';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-body.component.html',
  styleUrl: './main-body.component.css'
})
export class MainBodyComponent implements OnInit {
  title = 'Onlinequran';
  public surahs: Surah[] = [];
  public ayas: Aya[] = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.surahs = SurahListData;
    this.ayas = AyaListData;
  }

  gotoQuranPageByJuz(JuzNumber: number): void {
    let pageNr = Number(this.ayas.filter(x => x.juz == String(JuzNumber))[0].page);
    this.router.navigate(['/quran', pageNr]);
  }
  
  gotoQuranPageByPage(PageNumber: number): void {
    this.router.navigate(['/quran', PageNumber]);
  }
}
