import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import AyaListData from '../Mid/AyaList.json';
import SurahListData from '../Mid/SurahList.json';
import { Aya, Surah, QuranPage } from '../Models/QuranPageModle';
import { Component, ViewEncapsulation, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-quran-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './quran-page.component.html',
  styleUrl: './quran-page.component.css',
  encapsulation: ViewEncapsulation.None
})

export class QuranPageComponent {
  @ViewChild('ayasContainer') ayasContainer!: ElementRef;

  public ayas: Aya[] = [];
  public surahs: Surah[] = [];
  public quranPage: QuranPage;
  PageNumber: string;
  PageBody: String = "";
  PlaceHolder: String = "";
  IsDetails: String = "none";
  IsNormal: String = "Block";
  Show_Audio: String = "none";
  Running_URL: String = "none";

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => this.PageNumber = params['PageNumber']);
    this.getData(this.PageNumber);
  }

  getData(pageNumer: string) {
    this.surahs = SurahListData;
    this.ayas = AyaListData;

    this.quranPage = new QuranPage();

    let AyasPage = this.ayas.filter(a => a.page === pageNumer);
    AyasPage.forEach(xx => xx.surah_Infos = this.surahs.find(a => a.order.toString() === xx.sura));
    AyasPage.forEach(xx => {
      const sura = xx.sura.toString().padStart(3, '0');
      const aya = xx.aya.toString().padStart(3, '0');
      xx.URL = `https://everyayah.com/data/Ayman_Sowaid_64kbps/${sura}${aya}.mp3`;
    });

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
                                <td class="columon"><span class="SurahInfos">${aya?.sura} ترتيبها</span></td>
                                <td class="columon"><span class="SurahInfos">${aya?.surah_Infos?.name}</span></td>
                                <td class="columon"><span class="SurahInfos">${aya?.surah_Infos?.ayas} عدد أياتها</span></td>
                              </tr>
                            </table>
                          </div>`;

        if (aya.page != "187" && aya.page != "1") {
          this.PageBody += `<div> بِسْــــــمِ اللَّــــــهِ الرَّحْمَـٰــنِ الرَّحِيــــم</div>`;
        }
      }

      this.PlaceHolder += `<Span class="AyaClass">
                            <span>${aya?.text_uthmani}</span>
                            <span>﴿${aya?.aya}﴾</span>
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

  ngAfterViewInit() {
    this.ayasContainer.nativeElement.addEventListener('click', (event: Event) => {
      const target = (event.target as HTMLElement).closest('.AyaClass') as HTMLElement;
      if (target) {
        this.GoToAya_Details();
      }
    });
  }

  GoToAya_Details(): void {
    this.IsDetails = this.IsDetails === "none" ? "block" : "none";
    this.IsNormal = this.IsNormal === "none" ? "block" : "none";
    this.Show_Audio = this.IsNormal === "none" ? "flex" : "none";

    if (this.IsDetails == "none") {
      this.Running_URL = "none";
      this.Show_Audio = "none";
    }
  }

  Run_Audio(url: any): void {
    this.Running_URL = url;
  }
}
