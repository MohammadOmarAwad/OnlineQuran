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
import { TextService } from '../Services/Text.Service';
import { UrlResource } from '../Resources/UrlResource';
import { StringResource } from '../Resources/StringResource';

@Component({
  selector: 'app-quran-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './quran-page.component.html',
  styleUrls: ['../app.component.css', './quran-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class QuranPageComponent {
  Strings = StringResource;
  public AyasList: Aya[] = AyaListData as Aya[];
  public SurahsList: Surah[] = SurahListData as Surah[];
  public quranPage: QuranPage;
  public ResitorsList: Reciter[] = [];
  PageNumber: string;
  PageBody: String = "";
  PageBodyTafser: String = "";
  PageBodyWordAnalysis: String = "";
  PlaceHolder: String = "";
  IsDetails: boolean = false;
  Running_URL: String = "none";
  Reciter_URL: String = UrlResource.Recitors_Url;

  constructor(
    private activeRoute: ActivatedRoute,
    private clipboard: Clipboard,
    private toastr: ToastrService
  ) { }

  //Run on Start
  async ngOnInit(): Promise<void> {
    this.activeRoute.params.subscribe((params: Params) => this.PageNumber = params['PageNumber']);

    await this.getData(this.PageNumber);
    await this.getDataTafser(this.PageNumber);
    await this.getDataWordAnalysis(this.PageNumber);

    this.ResitorsList = RecitersListData;
  }

  //Get the Quran Text
  async getData(pageNumer: string): Promise<void> {
    this.quranPage = new QuranPage();

    let AyasPage = this.AyasList.filter(a => a.page === pageNumer);
    AyasPage.forEach(xx => xx.surah_Infos = this.SurahsList.find(a => a.order.toString() === xx.sura));
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

        this.PageBody += this.SurahHeaderBuilder(aya);

        if (aya.page != "187" && aya.page != "1") {
          this.PageBody += `<div>${StringResource.QuranPage_Basmale}</div>`;
        }
      }

      this.PlaceHolder += this.AyaBuilder(aya);

    });

    if (this.PlaceHolder != "") {
      this.PageBody += `<div class="LineClass">${this.PlaceHolder}</div>`
    }
  }

  //Build Aya Part
  AyaBuilder(aya: Aya): string {
    const output = `<Span class="AyaClass">
                            <span>${aya?.text_uthmani}</span>
                            <span class="qword">﴿${aya?.aya}﴾</span>
                          </Span>`;

    return TextService.bracketsReplacer(output).toString();
  }

  //Build SurahHeader Part
  SurahHeaderBuilder(aya: Aya): string {
    const output = `<br/>
                          <div> 
                            <table Class="SurhaHeader TableClass">
                              <tr>
                                <td class="textalign_right"><span class="qword AyaClass">﴿ ${aya?.sura} ${StringResource.QuranPage_SurahOrder} ﴾</span></td>
                                <td class="textalign_center"><span Class="AyaClass">﴿ ${aya?.surah_Infos?.name} ﴾</span></td>
                                <td class="textalign_Left"><span class="qword AyaClass">﴿ ${aya?.surah_Infos?.ayas} ${StringResource.QuranPage_AyaCount} ﴾</span></td>
                              </tr>
                            </table>
                          </div>`;

    return TextService.bracketsReplacer(output).toString();
  }

  //Get the Tafser of Quran
  async getDataTafser(pageNumer: string): Promise<void> {
    let ayas: Aya[] = AyaListData as Aya[];
    let tafser: AyahExtention[] = TafserData as AyahExtention[];

    let AyasPage = ayas.filter(a => a.page === pageNumer);
    this.PageBodyTafser = "";

    AyasPage.forEach((xx, index) => {
      const isLast = index === AyasPage.length - 1;

      const sura = xx.sura.toString();
      const aya = xx.aya.toString();

      let data = tafser.find(a => a.sura === sura && a.aya === aya);
      this.PageBodyTafser += `
      <Span class="LineClass">
        <span>${xx?.text_uthmani}</span>
        <span class="qword">﴿${aya}﴾</span>
        <br>
        <span>${data?.data}</span>
      </Span>`;

      if (!isLast) {
        this.PageBodyTafser += `<hr/>`;
      }
    })

    this.PageBodyTafser = TextService.bracketsReplacer(this.PageBodyTafser);
  }

  //Get the WordAnalysis of Quran
  async getDataWordAnalysis(pageNumer: string): Promise<void> {
    let ayas: Aya[] = AyaListData as Aya[];
    let quranicWords: AyahExtention[] = QuranicWordsData as AyahExtention[];

    let AyasPage = ayas.filter(a => a.page === pageNumer);
    this.PageBodyWordAnalysis = "";

    AyasPage.forEach((xx, index) => {
      const isLast = index === AyasPage.length - 1;

      const sura = xx.sura.toString();
      const aya = xx.aya.toString();

      let data = quranicWords.find(a => a.sura === sura && a.aya === aya);
      this.PageBodyWordAnalysis += `
      <Span class="LineClass">
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

    this.PageBodyWordAnalysis = TextService.bracketsReplacer(this.PageBodyWordAnalysis);
  }

  //Go to the Next Page
  GoToNextPage(pageNumer: String) {
    let newValue = Number(pageNumer) + 1;
    if (newValue == 605) {
      newValue = 1;
    }

    this.getData(String(newValue));
    this.getDataTafser(String(newValue));
    this.getDataWordAnalysis(String(newValue));
  }

  //Go to the Previous Page
  GoToPriviousePage(pageNumer: String) {
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
          
      ${UrlResource.OnlineQuran_Url}/quran/${AyaInfo.page}`;

      this.clipboard.copy(textToCopy);

      this.toastr.success(TextService.FormatMessage(StringResource.QuranPage_CopyMessage, AyaInfo.aya, AyaInfo.surah_Infos.name));
    }
  }

  //Applay Brackets
  BracketsReplacer(val: String): String {
    return TextService.bracketsReplacer(`﴿${val}﴾`);
  }
}
