import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import AyaListData from '../Mid/AyaList.json';
import SurahListData from '../Mid/SurahList.json';
import { Aya, Surah, QuranPage } from '../Models/QuranPageModle';

@Component({
  selector: 'app-quran-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './quran-page.component.html',
  styleUrl: './quran-page.component.css'
})
export class QuranPageComponent {
  public ayas: Aya[] = [];
  public surahs: Surah[] = [];
  public quranPage: QuranPage;
  PageNumber: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.PageNumber = params['PageNumber']);
    this.getData(this.PageNumber);
  }

  getData(pageNumer: string) {
    this.surahs = SurahListData;
    this.ayas = AyaListData;

    this.quranPage = new QuranPage();

    let AyasPage = this.ayas.filter(a => a.page === pageNumer);
    AyasPage.forEach(xx => xx.surah_Infos = this.surahs.find(a => a.order.toString() === xx.sura));

    this.quranPage.SurahNames = AyasPage[0].sura;
    this.quranPage.Ayas = AyasPage;
  }

  GoToNextPage(pageNumer: string)
  {
    let newValue = Number(pageNumer) + 1;
    if (newValue==604) {
      newValue = 1;
    }

    this.getData(String(newValue));
  }

  GoToPriviousePage(pageNumer: string)
  {
    let newValue = Number(pageNumer) - 1;
    if (newValue==0) {
      newValue = 604;
    }

    this.getData(String(newValue));
  }
}
