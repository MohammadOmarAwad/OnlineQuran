import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReciterModel } from '../Models/ReciterModel';
import { TextService } from '../Services/Text.Service';
import { StringResource } from '../Resources/StringResource';
import { DataService } from '../Services/Data.Service';
import { UtiltitiesService } from '../Services/Utiltities.Service';
import { SurahModel } from '../Models/SurahModel';
import { AyahModel } from '../Models/AyahModel';
import { TafserModel } from '../Models/TafserModel';
import { QuranicWordModel } from '../Models/QuranicWordModel';
import { SurahStoriesModel } from '../Models/SurahStoriesModel';

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
  SurahStoriesList: SurahStoriesModel[] = [];

  PageNumber: string;
  PageBodyTafser: String = "";
  PageBodyWordAnalysis: String = "";

  constructor(
    private activeRoute: ActivatedRoute,
    private utilities: UtiltitiesService
  ) { }

  //Run on Start
  async ngOnInit() {
    this.SurahsList = await DataService.GetSurahsData();
    this.AyahsList = await DataService.GetAyasData();
    this.RecitersList = await DataService.GetRecitersData();
    this.TafserAyahsList = await DataService.GetTafsersData();
    this.QuranicWordsList = await DataService.GetQuranicWordsData();
    this.SurahStoriesList = await DataService.GetSurahStoriesData();

    this.activeRoute.params.subscribe((params: Params) => this.PageNumber = params['PageNumber']);

    await Promise.all([
      this.UpdateQuranPage(Number(this.PageNumber))
    ]);
  }

  //Get the Quran Text
  async getData(pageNumer: Number): Promise<void> {
    const container = document.getElementById('nav-Quran') as HTMLDivElement;
    container.innerHTML = '';

    let AyasPage = this.AyahsList.filter(a => a.PageNr === pageNumer);
    AyasPage.forEach(xx => xx.surah_Infos = this.SurahsList.find(a => a.SurahIndex === xx.SuraNr));
    this.AyahsList_UI = AyasPage;

    let spansList: HTMLSpanElement[] = [];

    AyasPage.forEach(aya => {
      if (aya.AyaNr == 1) {

        if (spansList.length > 0) {
          this.AddElementsToBlock(spansList, container);
          spansList = [];
        }

        this.AddElementsToBlock(this.AddSurahTitle(aya), container);
      }

      spansList.push(this.AyaBuilder(aya));
    });

    if (spansList.length > 0) {
      this.AddElementsToBlock(spansList, container);
    }
  }

  //Add Elements to Block With Click Action
  private AddElementsToBlock(htmlList: HTMLElement[], container: HTMLDivElement) {

    const element = document.createElement('div');

    element.className = 'LineClass';
    // Loop through the NodeList and append each span individualy
    htmlList.forEach((span) => {
      element.appendChild(span);
    });

    container.appendChild(element);
  }

  //Build the Surah Title 
  private AddSurahTitle(xx: AyahModel) {
    const divsList: HTMLDivElement[] = [];

    if (xx.AyaNr == 1) {
      divsList.push(this.SurahHeaderBuilder(xx));

      if (xx.PageNr != 187 && xx.PageNr != 1) {
        const element = document.createElement('div');
        element.innerHTML = StringResource.QuranPage_Basmale;

        divsList.push(element);
      }
    }

    return divsList;
  }

  //Build Aya Part
  private AyaBuilder(aya: AyahModel) {
    const element = document.createElement('span');
    element.className = 'AyaClass';
    element.dataset['ayaId'] = aya.AyaNr.toString();
    element.dataset['surahId'] = aya.SuraNr.toString();

    const text = `<span> ${aya?.Text_Uthmani}</span>
                  <span class="qword">﴿${aya?.AyaNr}﴾</span>`;

    const output = TextService.bracketsReplacer(text).toString();
    element.innerHTML = output;

    // Listen for the right-click event
    element.addEventListener('contextmenu', (event: MouseEvent) => {
      // 1. Stop the browser's default standard right-click menu from showing up
      event.preventDefault();

      // 2. Prevent the event from bubbling up to other elements
      event.stopPropagation();

      // 3. Show your custom menu at the mouse coordinates
      this.utilities.ShowMenuList(event.clientX, event.clientY, element);
    });

    return element;
  }

  //Build SurahHeader Part
  private SurahHeaderBuilder(aya: AyahModel) {

    const element = document.createElement('div');
    const output = `<table Class="SurhaHeader TableClass">
                              <tr>
                                <td class="textalign_right"><span class="qword TitleClass">﴿ ${aya?.SuraNr} ${StringResource.QuranPage_SurahOrder} ﴾</span></td>
                                <td class="textalign_center"><span Class="TitleClass">﴿ ${aya?.surah_Infos?.AName} ﴾</span></td>
                                <td class="textalign_Left"><span class="qword TitleClass">﴿ ${aya?.surah_Infos?.AyasCount} ${StringResource.QuranPage_AyaCount} ﴾</span></td>
                              </tr>
                      </table>`;

    const text = TextService.bracketsReplacer(output).toString();

    element.innerHTML = text;

    return element;
  }

  //Get the Tafser of Quran
  async getDataTafser(): Promise<void> {
    this.PageBodyTafser = "";

    this.AyahsList_UI.forEach((xx, index) => {
      const isLast = index === this.AyahsList_UI.length - 1;

      const sura = xx.SuraNr;
      const aya = xx.AyaNr;

      let data = this.TafserAyahsList.find(a => a.SuraNr === sura && a.AyaNr === aya);

      // this.PageBodyTafser += this.AddSurahTitle(xx);

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
  async getDataWordAnalysis(): Promise<void> {
    this.PageBodyWordAnalysis = "";

    this.AyahsList_UI.forEach((xx, index) => {
      const isLast = index === this.AyahsList_UI.length - 1;

      const sura = xx.SuraNr;
      const aya = xx.AyaNr;

      let data = this.QuranicWordsList.find(a => a.SuraNr === sura && a.AyaNr === aya);

      // this.PageBodyWordAnalysis += this.AddSurahTitle(xx);

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

  //Get the SurahStories of Quran
  async getDataSurahStories(): Promise<void> {
    let stories: SurahStoriesModel[] = [];
    let tableRows: string = '';

    this.AyahsList_UI.forEach(element => {

      const surahStories = this.SurahStoriesList.filter(s => s.SurahIndex === element.SuraNr);
      let currentStory = surahStories.find(ss => element.AyaNr >= ss.StartStory && element.AyaNr <= ss.EndStory);

      // Add to the array if a matching story was found
      const itemDoesNotExist = !stories.some(ss =>
        ss.SurahIndex === element.SuraNr &&
        element.AyaNr >= ss.StartStory &&
        element.AyaNr <= ss.EndStory
      );

      if (currentStory && itemDoesNotExist) {
        stories.push(currentStory);
        const spanHtml = document.createElement('span');
        spanHtml.innerHTML = this.BracketsReplacer(`${currentStory.EndStory}-${currentStory.StartStory}`).toString();
        spanHtml.style.whiteSpace = "nowrap";

        tableRows += `<tr>
                  <td style="vertical-align: top; text-align-last: end; background-color: ${currentStory.Color};">
                     ${spanHtml.outerHTML}
                  </td>
                  <td style="line-height: 22px; text-align-last: start;padding-right: 5px;">${currentStory.Story}</td>
                </tr>`;
      }
    });

    const divElement = document.getElementById('SurahStoriesId') as HTMLDivElement;
    divElement.innerHTML = `<div><table>${tableRows}</table></div>`;;
  }

  //Go to the Next Page
  GoToNextPage(pageNumer: number) {
    let newValue = pageNumer + 1;
    if (newValue == 605) {
      newValue = 1;
    }

    this.UpdateQuranPage(newValue);
  }

  //Go to the Previous Page
  GoToPriviousePage(pageNumer: number) {
    let newValue = pageNumer - 1;
    if (newValue == 0) {
      newValue = 604;
    }

    this.UpdateQuranPage(newValue);
  }

  //Many Action To LoadPage
  private UpdateQuranPage(pageNumer: number) {
    this.getData(pageNumer);
    this.getDataTafser();
    this.getDataWordAnalysis();
    this.getDataSurahStories();
  }

  //Toggle the view of Quran
  CloseAudioPlayer(): void {
    const divElement = document.getElementById('SoundPlayerId') as HTMLDivElement;
    divElement.style.display = "none";

    this.utilities.Run_Audio(0, 0);
  }

  //Get the Reciter on dropdown
  onReciterChange(event: Event) {
    // Reset the AudioPlayer
    this.utilities.Run_Audio(0, 0);
  }

  //Applay Brackets
  BracketsReplacer(val: String): String {
    return TextService.bracketsReplacer(`﴿${val}﴾`);
  }
}
