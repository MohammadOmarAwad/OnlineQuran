import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import AyaListData from '../Mid/AyaList.json';
import SurahListData from '../Mid/SurahList.json';
import RecitersListData from '../Mid/Reciters.json';
import { Aya, Surah, QuranPage } from '../Models/QuranPageModle';
import { Component, ViewEncapsulation, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { Reciter } from '../Models/Reciter';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quran-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './quran-page.component.html',
  styleUrls: ['../app.component.css', './quran-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class QuranPageComponent {
  @ViewChild('ayasContainer') ayasContainer!: ElementRef;

  public surahs: Surah[] = [];
  public quranPage: QuranPage;
  public ResitorsList: Reciter[] = [];
  PageNumber: string;
  PageBody: String = "";
  PlaceHolder: String = "";
  IsDetails: boolean = false;
  Running_URL: String = "none";
  Reciter_URL: String = "https://verses.quran.com/AbdulBaset/Mujawwad/mp3/";

  constructor(
    private activeRoute: ActivatedRoute,
    private clipboard: Clipboard,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => this.PageNumber = params['PageNumber']);
    this.getData(this.PageNumber);

    this.ResitorsList = RecitersListData;
  }

  getData(pageNumer: string) {
    this.surahs = SurahListData;
    this.quranPage = new QuranPage();
    let ayas: Aya[] = AyaListData as Aya[];

    let AyasPage = ayas.filter(a => a.page === pageNumer);
    AyasPage.forEach(xx => xx.surah_Infos = this.surahs.find(a => a.order.toString() === xx.sura));
    AyasPage.forEach(xx => {
      const sura = xx.sura.toString().padStart(3, '0');
      const aya = xx.aya.toString().padStart(3, '0');
      xx.verse_Id = `${sura}${aya}.mp3`;
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
        this.GoToAya_Details(true);
      }
    });
  }

  GoToAya_Details(isShowen: boolean): void {
    this.IsDetails = isShowen;

    if (!this.IsDetails) {
      this.Running_URL = "none";
    }
  }

  Run_Audio(url: any): void {
    this.Running_URL = this.Reciter_URL + url;
  }

  AddCSSClass(): void {
    const items = document.querySelectorAll('.AyaClass');

    items.forEach(item => {
      item.addEventListener('click', () => {
        // Remove 'active' class from all items
        items.forEach(el => el.classList.remove('active'));

        // Add 'active' class to the clicked item
        item.classList.add('active');
      });
    });
  }

  onReciterChange(event: Event) {
    const selectedId = Number((event.target as HTMLSelectElement).value);
    let selectedReciterURL = this.ResitorsList.find(r => r.id === selectedId)?.Reciter_URL;

    if (selectedReciterURL != undefined) {
      this.Reciter_URL = selectedReciterURL;
    }
  }

  CopyAya(sura: String, aya: String): void {
    let AyaInfo: Aya | undefined;

    AyaInfo = this.quranPage.Ayas.find(a => a.sura === sura && a.aya === aya);
    if (AyaInfo != undefined) {
      //string interpolation in TypeScript (like C#’s $"..." syntax).
      let textToCopy = `
      ${AyaInfo.text_uthmani}
      
      ${AyaInfo.simple}      
      https://mohammadomarawad.github.io/OnlineQuran/quran/${AyaInfo.page}
      `;

      this.clipboard.copy(textToCopy);

      this.toastr.success(`تم نسخ الأية ${AyaInfo.aya} من سورة ${AyaInfo.surah_Infos.name}`);
    }
  }
}
