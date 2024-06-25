import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RadioModel } from '../Models/RadioModel';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-streams-page',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './streams-page.component.html',
  styleUrl: './streams-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class StreamsPageComponent {
  HttpClient = inject(HttpClient);
  Radios: RadioModel;
  PlaceHolder: String = "";

  ngOnInit() {
    this.HttpClient.get<RadioModel>("https://mp3quran.net/api/v3/radios?language=ar").subscribe((data: RadioModel) => {
      this.Radios = data;

      for (let i = 0; i < 80; i++) {
        this.PlaceHolder += `<div class="DivBoxRadio"><div>${this.Radios.radios[i]?.name}</div><audio controls src="${this.Radios.radios[i]?.url}"></audio></div>`;
      }
    });
  }

} 
