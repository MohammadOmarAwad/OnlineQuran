import AyaListData from '../Mid/AyaList.json';
import { Aya } from '../Models/QuranPageModle';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TextService } from '../Services/Text.Service';
import { StringResource } from '../Resources/StringResource';
import { SurahModel } from '../Models/SurahModel';
import { DataService } from '../Services/Data.Service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['../app.component.scss', './search-page.component.scss']
})

export class SearchPageComponent {
  Strings = StringResource;
  SurahsList: SurahModel[] = [];

  public ayasList: Aya[] = []
  constructor(private router: Router) { }

  //Run on Strat
  async ngOnInit() {
    this.SurahsList = await DataService.GetSurahsData();
  }

  //Search about Aya
  search(searchText: string): void {
    const keyword = TextService.ReplaceAlef(searchText).toLowerCase().trim();

    if (keyword.length < 3) {
      this.ayasList = [];
      return;
    }

    this.ayasList = (AyaListData as Aya[])
      .filter(a =>
        TextService.ReplaceAlef(a.simple)
          .toLowerCase()
          .includes(keyword)
      )
      .map(a => {
        const surah =this.SurahsList.find(s => s.SurahIndex.toString() === a.sura);

        return {
          ...a,
          aya: TextService.bracketsReplacer(`﴿${a.aya}﴾`),
          page: TextService.bracketsReplacer(`﴿${a.page}﴾`),
          surah_Infos: surah ? { ...surah, name: TextService.bracketsReplacer(`﴿${surah.AName}﴾`) } : null
        };
      });
  }

  //Go to Page
  gotoQuranPageByPage(PageNumber: String): void {
    this.router.navigate(['/quran', TextService.bracketsRemover(PageNumber)]);
  }

}