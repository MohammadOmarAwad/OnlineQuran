import { Component, ViewEncapsulation, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-streams-page',
  standalone: true,
  templateUrl: './streams-page.component.html',
  styleUrl: './streams-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class StreamsPageComponent {

  ComponentLiveMakka: SafeHtml;
  ComponentLiveMadina: SafeHtml;
  Running_URL: String = "None";

  constructor(private sanitizer: DomSanitizer) {
    this.Run_Video('https://www.youtube.com/embed/fRLNpcIwz34', 'Makka');
    this.Run_Video('https://www.youtube.com/embed/TpT8b8JFZ6E', 'Madina');
  }


  Run_Video(url: string, Element: String): void {
    const iframeString = `
      <iframe class='DivBox' width="560" height="315"
        src='${url}'
        frameborder="0"
        allowfullscreen>
      </iframe>`;

    if (Element == 'Makka') {
      this.ComponentLiveMakka = this.sanitizer.bypassSecurityTrustHtml(iframeString);
    }

    if (Element == 'Madina') {
      this.ComponentLiveMadina = this.sanitizer.bypassSecurityTrustHtml(iframeString);
    }
  }

  Run_Audio(url: any): void {
    this.Running_URL = url;
  }
} 
