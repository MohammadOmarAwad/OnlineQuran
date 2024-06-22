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
  HttpClient=inject(HttpClient);
  Radios: RadioModel;
  PlaceHolder: String = "";

  ngOnInit() {
    this.HttpClient.get<RadioModel>("https://mp3quran.net/api/v3/radios?language=ar").subscribe((data:RadioModel)=>
    {
     this.Radios=data;

     this.Radios.radios.forEach(radio => {
      this.PlaceHolder += `<div class="DivBoxRadio"><div>${radio?.name}</div><audio controls src="${radio?.url}">/audio></div>`;
      });
    });
  }

} 
