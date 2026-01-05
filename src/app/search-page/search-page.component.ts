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
    let ayas: Aya[] = AyaListData as Aya[];
    this.ayasList = [];
    if (searchText.length > 2 && searchText !== "") {

      ayas.forEach(element => {
        if (TextHelper.ReplaceAlef(element.simple).toLowerCase().includes(TextHelper.ReplaceAlef(searchText).toLowerCase())) {
          this.ayasList.push(element);
        }
      });

      this.ayasList.forEach(xx => xx.surah_Infos = SurahListData.find(a => a.order.toString() === xx.sura));
    }
  }

  //Go to Page
  gotoQuranPageByPage(PageNumber: string): void {
    this.router.navigate(['/quran', PageNumber]);
  }

}
