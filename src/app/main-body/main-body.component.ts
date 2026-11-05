import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StringResource } from '../Resources/StringResource';
import { DataService } from '../Services/Data.Service';
import { SurahModel } from '../Models/SurahModel';
import { AyahModel } from '../Models/AyahModel';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-body.component.html',
  styleUrls: ['../app.component.scss', './main-body.component.scss']
})

export class MainBodyComponent implements OnInit {
  Strings = StringResource;
  AyahsList: AyahModel[] = [];
  SurahsList: SurahModel[] = [];
  deviceType: string;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  //Run on Strat
  async ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => this.deviceType = params['DeviceType']);
    sessionStorage.setItem('deviceType', this.deviceType);

    if (sessionStorage.getItem('deviceType') == "WLog") {
      const divElementmainDiv = document.getElementById('mainDivMainBody') as HTMLDivElement;
      const divElementheaderId = document.getElementById('headerId') as HTMLDivElement;
      const divElementfooterId = document.getElementById('footerId') as HTMLDivElement;
      divElementmainDiv.style.minHeight = "100vh";
      divElementheaderId.style.display = "none";
      divElementfooterId.style.display = "none";
    }

    this.SurahsList = await DataService.GetSurahsData();
    this.AyahsList = await DataService.GetAyasData();
  }

  //Go to Quran Page by Juz
  gotoQuranPageByJuz(JuzNumber: number): void {
    let pageNr = Number(this.AyahsList.filter(x => x.Juz == JuzNumber)[0].PageNr);
    this.router.navigate(['/quran', pageNr]);
  }

  //Go to Quran Page by Page
  gotoQuranPageByPage(PageNumber: number): void {
    this.router.navigate(['/quran', PageNumber]);
  }
}
