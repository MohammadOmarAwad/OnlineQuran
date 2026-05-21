import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReciterModel } from '../Models/ReciterModel';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { TextService } from '../Services/Text.Service';
import { UrlResource } from '../Resources/UrlResource';
import { StringResource } from '../Resources/StringResource';
import { DataService } from '../Services/Data.Service';
import { SurahModel } from '../Models/SurahModel';
import { AyahModel } from '../Models/AyahModel';
import { TafserModel } from '../Models/TafserModel';
import { QuranicWordModel } from '../Models/QuranicWordModel';

@Component({
  selector: 'app-quran-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './quran-page.component.html',
  styleUrls: ['../app.component.scss', './quran-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class QuranPageComponent {
  Strings = StringResource;
  AyahsList: AyahModel[] = [];
  AyahsList_UI: AyahModel[] = [];
  SurahsList: SurahModel[] = [];
  RecitersList: ReciterModel[] = [];
  TafserAyahsList: TafserModel[] = [];
  QuranicWordsList: QuranicWordModel[] = [];

  PageNumber: string;
  PageBodyTafser: String = "";
  PageBodyWordAnalysis: String = "";
  IsDetails: boolean = false;
  Reciter_URL: String = UrlResource.Recitors_Url;

  constructor(
    private activeRoute: ActivatedRoute,
    private clipboard: Clipboard,
    private toastr: ToastrService
  ) { }

  //Run on Start
  async ngOnInit() {
    this.SurahsList = await DataService.GetSurahsData();
    this.AyahsList = await DataService.GetAyasData();
    this.RecitersList = await DataService.GetRecitersData();
    this.TafserAyahsList = await DataService.GetTafsersData();
    this.QuranicWordsList = await DataService.GetQuranicWordsData();

    this.activeRoute.params.subscribe((params: Params) => this.PageNumber = params['PageNumber']);

    await Promise.all([
      this.getData(this.PageNumber),
      this.getDataTafser(this.PageNumber),
      this.getDataWordAnalysis(this.PageNumber)
    ]);
  }

  //Get the Quran Text
  async getData(pageNumer: string): Promise<void> {
    const container = document.getElementById('nav-Quran') as HTMLDivElement;
    container.innerHTML = '';

    let AyasPage = this.AyahsList.filter(a => a.PageNr === Number(pageNumer));
    AyasPage.forEach(xx => xx.surah_Infos = this.SurahsList.find(a => a.SurahIndex === xx.SuraNr));
    AyasPage.forEach(xx => {
      const sura = xx.SuraNr.toString().padStart(3, '0');
      const aya = xx.AyaNr.toString().padStart(3, '0');
      xx.verse_Id = `${sura}${aya}.mp3`;
    });

    this.AyahsList_UI = AyasPage;

    let placeHolder: string = "";

    AyasPage.forEach(aya => {
      if (aya.AyaNr == 1) {

        if (placeHolder != "") {
          this.AddElementsToBlock(placeHolder, container, true);
          placeHolder = "";
        }

        this.AddElementsToBlock(this.AddSurahTitle(aya), container, false);
      }

      placeHolder += this.AyaBuilder(aya);
    });

    if (placeHolder != "") {
      this.AddElementsToBlock(placeHolder, container, true);
    }
  }

  //Add Elements to Block With Click Action
  private AddElementsToBlock(placeHolder: string, container: HTMLDivElement, withClick: boolean) {

    if (!container) {
      return;
    }

    const element = document.createElement('div');

    element.className = 'LineClass';
    element.innerHTML = placeHolder;

    if (withClick) {
      element.addEventListener('click', () => {
        this.GoToAya_Details(true);
      });
    }

    container.appendChild(element);
  }

  //Build the Surah Title 
  private AddSurahTitle(xx: AyahModel): string {

    let result = "";

    if (xx.AyaNr == 1) {
      result += this.SurahHeaderBuilder(xx);

      if (xx.PageNr != 187 && xx.PageNr != 1) {
        result += `<div>${StringResource.QuranPage_Basmale}</div>`;
      }
    }

    return result;
  }

  //Build Aya Part
  AyaBuilder(aya: AyahModel): string {
    const output = `<Span class="AyaClass">
                            <span>${aya?.Text_Uthmani}</span>
                            <span class="qword">﴿${aya?.AyaNr}﴾</span>
                          </Span>`;

    return TextService.bracketsReplacer(output).toString();
  }

  //Build SurahHeader Part
  SurahHeaderBuilder(aya: AyahModel): string {
    const output = `<br/>
                          <div> 
                            <table Class="SurhaHeader TableClass">
                              <tr>
                                <td class="textalign_right"><span class="qword AyaClass">﴿ ${aya?.SuraNr} ${StringResource.QuranPage_SurahOrder} ﴾</span></td>
                                <td class="textalign_center"><span Class="AyaClass">﴿ ${aya?.surah_Infos?.AName} ﴾</span></td>
                                <td class="textalign_Left"><span class="qword AyaClass">﴿ ${aya?.surah_Infos?.AyasCount} ${StringResource.QuranPage_AyaCount} ﴾</span></td>
                              </tr>
                            </table>
                          </div>`;

    return TextService.bracketsReplacer(output).toString();
  }

  //Get the Tafser of Quran
  async getDataTafser(pageNumer: string): Promise<void> {
    let ayas: AyahModel[] = this.AyahsList;

    let AyasPage = ayas.filter(a => a.PageNr === Number(pageNumer));
    this.PageBodyTafser = "";

    AyasPage.forEach((xx, index) => {
      const isLast = index === AyasPage.length - 1;

      const sura = xx.SuraNr;
      const aya = xx.AyaNr;

      let data = this.TafserAyahsList.find(a => a.SuraNr === sura && a.AyaNr === aya);

      this.PageBodyTafser += this.AddSurahTitle(xx);

      this.PageBodyTafser += `
      <Span class="LineClass">
        <span>${xx?.Text_Uthmani}</span>
        <span class="qword">﴿${aya}﴾</span>
        <br>
        <span>${data?.ArabicValue}</span>
      </Span>`;

      if (!isLast) {
        this.PageBodyTafser += `<hr/>`;
      }
    })

    this.PageBodyTafser = TextService.bracketsReplacer(this.PageBodyTafser);
  }

  //Get the WordAnalysis of Quran
  async getDataWordAnalysis(pageNumer: string): Promise<void> {
    let ayas: AyahModel[] = this.AyahsList;

    let AyasPage = ayas.filter(a => a.PageNr === Number(pageNumer));
    this.PageBodyWordAnalysis = "";

    AyasPage.forEach((xx, index) => {
      const isLast = index === AyasPage.length - 1;

      const sura = xx.SuraNr;
      const aya = xx.AyaNr;

      let data = this.QuranicWordsList.find(a => a.SuraNr === sura && a.AyaNr === aya);

      this.PageBodyWordAnalysis += this.AddSurahTitle(xx);

      this.PageBodyWordAnalysis += `
      <Span class="LineClass">
        <span>${xx?.Text_Uthmani}</span>
        <span class="qword">﴿${aya}﴾</span>
      </Span>`;

      let piecesofData = data?.DataValue.split('\n');
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
  GoToNextPage(pageNumer: number) {
    let newValue = pageNumer + 1;
    if (newValue == 605) {
      newValue = 1;
    }

    this.getData(String(newValue));
    this.getDataTafser(String(newValue));
    this.getDataWordAnalysis(String(newValue));
  }

  //Go to the Previous Page
  GoToPriviousePage(pageNumer: number) {
    let newValue = pageNumer - 1;
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

    const audio = document.getElementById("quranAudioPlayer") as HTMLAudioElement;
    audio.src = "";
  }

  //Set the Audio URL to Audio Player
  Run_Audio(url: any): void {
    const audio = document.getElementById("quranAudioPlayer") as HTMLAudioElement;

    if (audio) {
      audio.pause();
      audio.src = this.Reciter_URL + url;
      audio.currentTime = 0;
      audio.play();
    }
  }

  //Add Style to selected Aya by id on Click
  AddActiveCSSClass(val: number): void {
    let item = document.getElementById(val.toString());

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
    let selectedReciterURL = this.RecitersList.find(r => r.ReciterId === selectedId)?.Reciter_URL;

    if (selectedReciterURL != undefined) {
      this.Reciter_URL = selectedReciterURL;
    }
  }

  //Copy Aya by Clicking
  CopyAya(sura: number, aya: number): void {
    let AyaInfo: AyahModel | undefined;

    AyaInfo = this.AyahsList_UI.find(a => a.SuraNr === sura && a.AyaNr === aya);
    if (AyaInfo != undefined) {
      //string interpolation in TypeScript (like C#’s $"..." syntax).
      let textToCopy = `
      ${AyaInfo.Text_Uthmani}
      
      ${AyaInfo.Text_Simple}  
          
      ${UrlResource.OnlineQuran_Url}/quran/${AyaInfo.PageNr}`;

      this.clipboard.copy(textToCopy);

      this.toastr.success(TextService.FormatMessage(StringResource.QuranPage_CopyMessage, AyaInfo.AyaNr, AyaInfo.surah_Infos.name));
    }
  }

  //Applay Brackets
  BracketsReplacer(val: String): String {
    return TextService.bracketsReplacer(`﴿${val}﴾`);
  }
}
