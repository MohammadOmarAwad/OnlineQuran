import { Component, ViewEncapsulation, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StringResource } from '../Resources/StringResource';
import { UrlResource } from '../Resources/UrlResource';

@Component({
  selector: 'app-streams-page',
  standalone: true,
  templateUrl: './streams-page.component.html',
  styleUrls: ['../app.component.css', './streams-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class StreamsPageComponent {

  Strings = StringResource;
  Urls = UrlResource;
  ComponentLiveMakka: SafeHtml;
  ComponentLiveMadina: SafeHtml;
  Running_URL: String = "None";
  IsMakka: 'Makka';
  IsMadina: 'Madina';

  constructor(private sanitizer: DomSanitizer) {
    this.Run_Video(UrlResource.MakkaLive1, this.IsMakka);
    this.Run_Video(UrlResource.MadineLive1, this.IsMadina);
  }

  //Run Video from Stream
  Run_Video(url: string, Element: String): void {
    const iframeString = `
      <iframe class='DivBox' width="560" height="315"
        src='${url}'
        frameborder="0"
        allowfullscreen>
      </iframe>`;

    if (Element == this.IsMakka) {
      this.ComponentLiveMakka = this.sanitizer.bypassSecurityTrustHtml(iframeString);
    }

    if (Element == this.IsMadina) {
      this.ComponentLiveMadina = this.sanitizer.bypassSecurityTrustHtml(iframeString);
    }
  }

  //Set Audio to AudioPlayer
  Run_Audio(url: any): void {
    this.Running_URL = url;
  }
} 
