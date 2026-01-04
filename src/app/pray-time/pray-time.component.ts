import { Component } from '@angular/core';
import GeolocationProvider from '../Services/GeolocationProvider';
import DateProvider from '../Services/DateProvider';
import { HttpClient } from '@angular/common/http';
import { PrayTimeModle, Daum } from '../Models/PrayTimeModle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pray-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pray-time.component.html',
  styleUrls: ['../app.component.css', './pray-time.component.css'],
})
export class PrayTimeComponent {
  public prayTimeModle: PrayTimeModle;
  public PrayTimeToday: Daum;
  public CityName: String;

  constructor(
    private http: HttpClient
  ) { }

  //Run on Strat
  ngOnInit() {
    GeolocationProvider.getLocation().then((loc) => { this.callAladhanApi(loc[0], loc[1]); });
    GeolocationProvider.getCityName().then(output => { this.CityName = output; });
  }

  //Call the ParyTime Athan
  callAladhanApi(Longitude: String, Latitude: String) {
    const methode = "3";
    const shafaq = "general";
    const year = DateProvider.GetHijriDateYear();
    const monthe = DateProvider.GetHijriDateMonth();
    const url = `https://api.aladhan.com/v1/hijriCalendar/${year}/${monthe}?longitude=${Longitude}&latitude=${Latitude}&method=${methode}&shafaq=${shafaq}`
    this.http.get<PrayTimeModle>(url).subscribe(data => {

      this.prayTimeModle = data
      let date = DateProvider.GetDate();

      const today = data.data.find(xx => xx.date.gregorian.date === date);

      if (!today) {
        throw new Error('Today prayer data not found');
      }

      this.PrayTimeToday = today;

      console.log(data);
    });


  }
}
