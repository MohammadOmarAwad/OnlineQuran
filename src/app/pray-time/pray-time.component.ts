import { Component } from '@angular/core';
import { GeolocationService } from '../Services/Geolocation.Service';
import { DateService } from '../Services/Date.Service';
import { HttpClient } from '@angular/common/http';
import { PrayTimeModle, Daum } from '../Models/PrayTimeModle';
import { CommonModule } from '@angular/common';
import { StringResource } from '../Resources/StringResource';
import { UrlResource } from '../Resources/UrlResource';

@Component({
  selector: 'app-pray-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pray-time.component.html',
  styleUrls: ['../app.component.css', './pray-time.component.css'],
})

export class PrayTimeComponent {
  Strings = StringResource;
  public prayTimeModle: PrayTimeModle;
  public PrayTimeToday?: Daum;
  public CityName: String;

  constructor(
    private http: HttpClient
  ) { }

  //Run on Strat
  ngOnInit() {
    GeolocationService.getLocation().then((loc) => { this.callAladhanApi(loc[0], loc[1]); });
    GeolocationService.getCityName().then(output => { this.CityName = output; });
  }

  //Call the ParyTime Athan
  callAladhanApi(Longitude: String, Latitude: String) {
    const methode = "3";
    const shafaq = "general";
    const year = DateService.GetHijriDateYear();
    const monthe = DateService.GetHijriDateMonth();
    const url = `${UrlResource.PrayTime_Url}${year}/${monthe}?longitude=${Longitude}&latitude=${Latitude}&method=${methode}&shafaq=${shafaq}`
    this.http.get<PrayTimeModle>(url).subscribe(data => {

      this.prayTimeModle = data
      let date = DateService.GetDate();

      const today = data.data.find(xx => xx.date.gregorian.date === date);

      if (!today) {
        throw new Error(StringResource.PrayTime_Error);
      }

      this.PrayTimeToday = today;
    });


  }
}
