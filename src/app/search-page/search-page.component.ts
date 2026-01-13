import AyaListData from '../Mid/AyaList.json';
import SurahListData from '../Mid/SurahList.json';
import { Aya } from '../Models/QuranPageModle';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TextService } from '../Services/Text.Service';
import { StringResource } from '../Resources/StringResource';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['../app.component.scss', './search-page.component.scss']
})

export class SearchPageComponent {
    Strings = StringResource;
  
  public ayasList: Aya[] = []
  constructor(private router: Router) { }

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
        const surah = SurahListData.find(s => s.order.toString() === a.sura);

        return {
          ...a,
          aya: TextService.bracketsReplacer(`﴿${a.aya}﴾`),
          page: TextService.bracketsReplacer(`﴿${a.page}﴾`),
          surah_Infos: surah ? { ...surah, name: TextService.bracketsReplacer(`﴿${surah.name}﴾`) } : null
        };
      });
  }

  //Go to Page
  gotoQuranPageByPage(PageNumber: String): void {
    this.router.navigate(['/quran', TextService.bracketsRemover(PageNumber)]);
  }

}
