import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TextService } from '../Services/Text.Service';
import { StringResource } from '../Resources/StringResource';
import { SurahModel } from '../Models/SurahModel';
import { DataService } from '../Services/Data.Service';
import { AyahModel } from '../Models/AyahModel';
import { SearchResultModel } from '../Models/SearchResultModel';

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
  AyahsList: AyahModel[] = [];
  SearchResult: SearchResultModel[] = [];

  constructor(private router: Router) { }

  //Run on Strat
  async ngOnInit() {
    this.SurahsList = await DataService.GetSurahsData();
    this.AyahsList = await DataService.GetAyasData();
  }

  //Search about Aya
  search(searchText: string): void {
    const keyword = TextService.ReplaceAlef(searchText).toLowerCase().trim();

    if (keyword.length < 3) {
      this.SearchResult = [];
      return;
    }

    this.SearchResult = this.AyahsList
      .filter(a =>
        TextService.ReplaceAlef(a.Text_Simple)
          .toLowerCase()
          .includes(keyword)
      )
      .map(a => {
        const surah = this.SurahsList.find(s => s.SurahIndex === a.SuraNr);

        return {
          AyaNr: TextService.bracketsReplacer(`﴿${a.AyaNr}﴾`),
          PageNr: TextService.bracketsReplacer(`﴿${a.PageNr}﴾`),
          Text_Uthmani: a.Text_Uthmani,
          SurahName: TextService.bracketsReplacer(`﴿${surah?.AName}﴾`)
        };
      });
  }

  //Go to Page
  gotoQuranPageByPage(PageNumber: String): void {
    this.router.navigate(['/quran', TextService.bracketsRemover(PageNumber)]);
  }

}