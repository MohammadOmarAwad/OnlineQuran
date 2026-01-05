import { Component } from '@angular/core';
import AyaListData from '../Mid/AyaList.json';
import SurahListData from '../Mid/SurahList.json';
import { Aya } from '../Models/QuranPageModle';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TextHelper } from '../Services/TextHelper';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['../app.component.css', './search-page.component.css']
})

export class SearchPageComponent {
  public ayasList: Aya[] = []
  constructor(private router: Router) { }

  //Search about Aya
  search(searchText: string): void {
    const keyword = TextHelper.ReplaceAlef(searchText).toLowerCase().trim();

    if (keyword.length < 3) {
      this.ayasList = [];
      return;
    }

    this.ayasList = (AyaListData as Aya[])
      .filter(a =>
        TextHelper.ReplaceAlef(a.simple)
          .toLowerCase()
          .includes(keyword)
      )
      .map(a => {
        const surah = SurahListData.find(s => s.order.toString() === a.sura);

        return {
          ...a,
          aya: TextHelper.bracketsReplacer(`﴿${a.aya}﴾`),
          page: TextHelper.bracketsReplacer(`﴿${a.page}﴾`),
          surah_Infos: surah ? { ...surah, name: TextHelper.bracketsReplacer(`﴿${surah.name}﴾`) } : null
        };
      });
  }

  //Go to Page
  gotoQuranPageByPage(PageNumber: String): void {
    this.router.navigate(['/quran', PageNumber]);
  }

}
