import { Component, OnInit } from '@angular/core';
import { Aya } from '../Models/QuranPageModle';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import AyaListData from '../Mid/AyaList.json';
import { CommonModule } from '@angular/common';
import { StringResource } from '../Resources/StringResource';
import { DataService } from '../Services/Data.Service';
import { SurahModel } from '../Models/SurahModel';

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-body.component.html',
  styleUrls: ['../app.component.scss', './main-body.component.scss']
})

export class MainBodyComponent implements OnInit {
  Strings = StringResource;
  AyasList: Aya[] = AyaListData as Aya[];
  SurahsList: SurahModel[] = [];

  constructor(private router: Router) { }

  //Run on Strat
  async ngOnInit() {
    this.SurahsList = await DataService.GetSurahsData();
  }

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
