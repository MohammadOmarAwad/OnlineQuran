import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import AyaListData from '../Mid/AyaList.json';
import SurahListData from '../Mid/SurahList.json';
import RecitersListData from '../Mid/Reciters.json';
import TafserData from '../Mid/Tafser.json';
import QuranicWordsData from '../Mid/QuranicWords.json';
import { Aya, Surah, QuranPage } from '../Models/QuranPageModle';
import { AyahExtention } from '../Models/AyahExtention';
import { Component, ViewEncapsulation } from '@angular/core';
import { Reciter } from '../Models/Reciter';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { TextHelper } from '../Services/TextHelper';

@Component({
  selector: 'app-quran-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './quran-page.component.html',
  styleUrls: ['../app.component.css', './quran-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class QuranPageComponent {

  public surahs: Surah[] = [];
  public quranPage: QuranPage;
  public ResitorsList: Reciter[] = [];
  PageNumber: string;
  PageBody: String = "";
  PageBodyTafser: String = "";
  PageBodyWordAnalysis: String = "";
  PlaceHolder: String = "";
  IsDetails: boolean = false;
  Running_URL: String = "none";
  Reciter_URL: String = "https://verses.quran.com/AbdulBaset/Mujawwad/mp3/";

  constructor(
    private activeRoute: ActivatedRoute,
    private clipboard: Clipboard,
    private toastr: ToastrService
  ) { }

  //Run on Start
  async ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => this.PageNumber = params['PageNumber']);

    await this.getData(this.PageNumber);
    await this.getDataTafser(this.PageNumber);
    await this.getDataWordAnalysis(this.PageNumber);

    this.ResitorsList = RecitersListData;
  }

  //Get the Quran Text
  async getData(pageNumer: string) {
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
                            <span class="qword">﴿${aya?.aya}﴾</span>
                          </Span>`;

    });

    if (this.PlaceHolder != "") {
      this.PageBody += `<div class="LineClass">${this.PlaceHolder}</div>`
    }

    this.PageBody = TextHelper.bracketsReplacer(this.PageBody);
  }

  //Get the Tafser of Quran
  async getDataTafser(pageNumer: string) {
    let ayas: Aya[] = AyaListData as Aya[];
    let tafser: AyahExtention[] = TafserData as AyahExtention[];

    let AyasPage = ayas.filter(a => a.page === pageNumer);
    this.PageBodyTafser = "";

    AyasPage.forEach((xx, index) => {
      const isLast = index === AyasPage.length - 1;

      const sura = xx.sura.toString();
      const aya = xx.aya.toString();

      let data = tafser.find(a => a.sura === sura && a.aya === aya);
      this.PageBodyTafser += `<Span class="WordAnalysisClass">
        <span>${data?.data}</span>
        <span class="qword">﴿${aya}﴾</span>
        </Span>`;

      if (!isLast) {
        this.PageBodyTafser += `<hr/>`;
      }
    })

    this.PageBodyTafser = TextHelper.bracketsReplacer(this.PageBodyTafser);
  }

  //Get the WordAnalysis of Quran
  async getDataWordAnalysis(pageNumer: string) {
    let ayas: Aya[] = AyaListData as Aya[];
    let quranicWords: AyahExtention[] = QuranicWordsData as AyahExtention[];

    let AyasPage = ayas.filter(a => a.page === pageNumer);
    this.PageBodyWordAnalysis = "";

    AyasPage.forEach((xx, index) => {
      const isLast = index === AyasPage.length - 1;

      const sura = xx.sura.toString();
      const aya = xx.aya.toString();

      let data = quranicWords.find(a => a.sura === sura && a.aya === aya);
      this.PageBodyWordAnalysis += `<Span class="AyaClass">
        <span>${xx?.text_uthmani}</span>
        <span class="qword">﴿${aya}﴾</span>
        </Span>`;

      let piecesofData = data?.data.split('\n');
      let piecesofDataresult = '';
      piecesofData?.forEach((pp) => {
        piecesofDataresult += `<li>${pp.replace('•', '').replace(/﴿(.*?)﴾/g, `<span class="qword">﴿$1﴾</span>`)}</li>`;
      });

      this.PageBodyWordAnalysis += `<div class="WordAnalysisClass"> <ul>${piecesofDataresult}</ul></div>`;

      if (!isLast) {
        this.PageBodyWordAnalysis += `<hr/>`;
      }
    })

    this.PageBodyWordAnalysis = TextHelper.bracketsReplacer(this.PageBodyWordAnalysis);
  }

  //Go to the Next Page
  GoToNextPage(pageNumer: string) {
    let newValue = Number(pageNumer) + 1;
    if (newValue == 605) {
      newValue = 1;
    }

    this.getData(String(newValue));
    this.getDataTafser(String(newValue));
    this.getDataWordAnalysis(String(newValue));
  }

  //Go to the Previous Page
  GoToPriviousePage(pageNumer: string) {
    let newValue = Number(pageNumer) - 1;
    if (newValue == 0) {
      newValue = 604;
    }

    this.getData(String(newValue));
    this.getDataTafser(String(newValue));
    this.getDataWordAnalysis(String(newValue));
  }

  //Toggle the view of Quran
  GoToAya_Details(isShowen: boolean): void {
    this.RemoveActiveCSSClass()

    this.IsDetails = isShowen;

    if (!this.IsDetails) {
      this.Running_URL = "none";
    }
  }

  //Set the Audio URL to Audio Player
  Run_Audio(url: any): void {
    this.Running_URL = this.Reciter_URL + url;
  }

  //Add Style to selected Aya by id on Click
  AddActiveCSSClass(val: string): void {
    let item = document.getElementById(val);

    // Add 'active' class to the clicked item
    if (item != null) {
      this.RemoveActiveCSSClass()
      item.classList.add('active');
    }
  }

  //Add Style to selected Aya on Click
  RemoveActiveCSSClass(): void {
    document.querySelectorAll('.AyaClass.active').forEach(el => el.classList.remove('active'));
  }

  //Get the Reciter on dropdown
  onReciterChange(event: Event) {
    const selectedId = Number((event.target as HTMLSelectElement).value);
    let selectedReciterURL = this.ResitorsList.find(r => r.id === selectedId)?.Reciter_URL;

    if (selectedReciterURL != undefined) {
      this.Reciter_URL = selectedReciterURL;
    }
  }

  //Copy Aya by Clicking
  CopyAya(sura: String, aya: String): void {
    let AyaInfo: Aya | undefined;

    AyaInfo = this.quranPage.Ayas.find(a => a.sura === sura && a.aya === aya);
    if (AyaInfo != undefined) {
      //string interpolation in TypeScript (like C#’s $"..." syntax).
      let textToCopy = `
      ${AyaInfo.text_uthmani}
      
      ${AyaInfo.simple}  
          
      https://mohammadomarawad.github.io/OnlineQuran/quran/${AyaInfo.page}`;

      this.clipboard.copy(textToCopy);

      this.toastr.success(`تم نسخ الأية ${AyaInfo.aya} من سورة ${AyaInfo.surah_Infos.name}`);
    }
  }
}
