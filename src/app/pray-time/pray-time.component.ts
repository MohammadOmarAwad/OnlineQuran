import { Component } from '@angular/core';
import { GeolocationService } from '../Services/Geolocation.Service';
import { DateService } from '../Services/Date.Service';
import { HttpClient } from '@angular/common/http';
import { PrayTimeModle, Daum } from '../Models/PrayTimeModle';
import { CommonModule } from '@angular/common';
import { StringResource } from '../Resources/StringResource';
import { UrlResource } from '../Resources/UrlResource';
import { PrayerCalculationMethods } from '../Resources/PrayerCalculationMethods';

@Component({
  selector: 'app-pray-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pray-time.component.html',
  styleUrls: ['../app.component.scss', './pray-time.component.scss'],
})

export class PrayTimeComponent {
  Strings = StringResource;
  public prayTimeModle: PrayTimeModle;
  public PrayTimeToday?: Daum;
  public CityName: String;
  Methods = PrayerCalculationMethods.method;
  Schools = PrayerCalculationMethods.school;


  constructor(
    private http: HttpClient
  ) { }

  //Run on Strat
  ngOnInit() {
    this.UpdatePrayTime();
  }

  //Call the ParyTime Athan
  callAladhanApi(Longitude: String, Latitude: String) {

    const selectedMethode = this.GetSelectedValue('prayTimeMethode')
    const methode = `&method=${selectedMethode}`;

    // Custome Methode 99 (FajrAngle,MaghribAngleOrMinsAfterSunset,IshaAngleOrMinsAfterMaghrib) (15.5,null,17.5)
    let methodSettings = "";
    if (selectedMethode === "99") {
      const fajer = this.GetValue("FajrAngleId");
      const magrib = this.GetValue("MaghribAngleOrMinsAfterSunsetId");
      const isha = this.GetValue("IshaAngleOrMinsAfterMaghribId");
      methodSettings = `&methodSettings=${fajer},${magrib},${isha}`;
    }

    const school = `&school=${this.GetSelectedValue('prayTimeSchool')}`;

    // tune  Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight (in Minute)
    const tune = `&tune=${this.GetValue("ImsakTuneId")},`
      + `${this.GetValue("FajrTuneId")},`
      + `${this.GetValue("SunriseTuneId")},`
      + `${this.GetValue("DhuhrTuneId")},`
      + `${this.GetValue("AsrTuneId")},`
      + `${this.GetValue("MaghribTuneId")},`
      + `${this.GetValue("SunsetTuneId")},`
      + `${this.GetValue("IshaTuneId")},`
      + `${this.GetValue("MidnightTuneId")}`;

    const year = DateService.GetHijriDateYear();
    const monthe = DateService.GetHijriDateMonth();

    const url = `${UrlResource.PrayTime_Url}${year}/${monthe}?longitude=${Longitude}&latitude=${Latitude}${methode}${methodSettings}${school}${tune}`
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

  // Get the DropDownList Value
  private GetSelectedValue(id: string) {
    const element = document.getElementById(id) as HTMLSelectElement

    return element.value;
  }

  // Get the TextBox Value
  private GetValue(id: string) {
    const element = document.getElementById(id) as HTMLInputElement

    if (!element?.value)
      return "0";

    return element?.value;
  }

  // Get the PrayTime Value
  UpdatePrayTime() {
    GeolocationService.getLocation().then((loc) => { this.callAladhanApi(loc[0], loc[1]); });
    GeolocationService.getCityName().then(output => { this.CityName = output; });
  }
}
