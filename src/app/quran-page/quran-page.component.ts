import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import AyaListData from '../Mid/AyaList.json';
import SurahListData from '../Mid/SurahList.json';
import { Aya, Surah, QuranPage } from '../Models/QuranPageModle';

@Component({
  selector: 'app-quran-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './quran-page.component.html',
  styleUrl: './quran-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class QuranPageComponent {
  public ayas: Aya[] = [];
  public surahs: Surah[] = [];
  public quranPage: QuranPage;
  PageNumber: string;
  PageBody: String = "";
  PlaceHolder: String = "";

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

    this.PageBody = "";
    this.PlaceHolder = "";

    AyasPage.forEach(aya => {
      if (aya.aya == "1") {

        if (this.PlaceHolder != "") {
          this.PageBody += `<div class="LineClass">${this.PlaceHolder}</div>`
          this.PlaceHolder = "";
        }

        this.PageBody += `<br/>
                          <div> 
                            <table class="NameClass">
                              <tr style="white-space: nowrap; background-color: transparent;">
                                <td><span class="SurahInfos">${aya?.sura} ترتيبها</span></td>
                                <td style="width:100%;">
                                  <div class="Surah-Seperator"><div>${aya?.surah_Infos?.name}</div></div>
                                </td>
                                <td><span class="SurahInfos">${aya?.sura} عدد أياتها</span></td>
                              </tr>
                            </table>
                          </div>`;

        if (aya.page != "187" && aya.page != "1") {
          this.PageBody += `<div> بِسْــــــمِ اللَّــــــهِ الرَّحْمَـٰــنِ الرَّحِيــــم</div>`;
        }
      }

      this.PlaceHolder += `<Span>
                            <span>${aya?.text_uthmani}</span>
                            <span class="AyaNumClass">${aya?.aya}</span>
                          </Span>`;

    });

    if (this.PlaceHolder != "") {
      this.PageBody += `<div class="LineClass">${this.PlaceHolder}</div>`
    }
  }

  GoToNextPage(pageNumer: string) {
    let newValue = Number(pageNumer) + 1;
    if (newValue == 605) {
      newValue = 1;
    }

    this.getData(String(newValue));
  }

  GoToPriviousePage(pageNumer: string) {
    let newValue = Number(pageNumer) - 1;
    if (newValue == 0) {
      newValue = 604;
    }

    this.getData(String(newValue));
  }
}
