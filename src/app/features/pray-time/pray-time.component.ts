import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrayTimeModle, Daum } from '../../core/models/PrayTimeModle';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { StringResource } from '../../core/resources/StringResource';
import { PrayerCalculationMethods } from '../../core/resources/PrayerCalculationMethods';
import { UtiltitiesService } from '../../core/services/Utiltities.Service';
import { DateService } from '../../core/services/Date.Service';
import { UrlResource } from '../../core/resources/UrlResource';
import { GeolocationService } from '../../core/services/Geolocation.Service';

@Component({
  selector: 'app-pray-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pray-time.component.html',
  styleUrls: ['../../app.component.scss', './pray-time.component.scss'],
})

export class PrayTimeComponent {
  Strings = StringResource;
  public prayTimeModle: PrayTimeModle;
  public PrayTimeToday?: Daum;
  public CityName: String;
  Methods = PrayerCalculationMethods.method;
  Schools = PrayerCalculationMethods.school;
  LatitudeAdjustment = PrayerCalculationMethods.latitudeAdjustmentMethod;
  deviceType: string;

  constructor(
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private utilities: UtiltitiesService
  ) { }

  //Run on Strat
  ngOnInit() {
    this.UpdatePrayTime();

    this.activeRoute.params.subscribe((params: Params) => this.deviceType = params['DeviceType']);

    if (this.deviceType == "WLog") {
      this.utilities.SetElementStyle('headerId', 'display', "none");
      this.utilities.SetElementStyle('footerId', 'display', "none");
      this.utilities.SetElementStyle('mainDivPrayTime', 'minHeight', "100vh");
    }
  }

  //Call the ParyTime Athan
  callAladhanApi(address: string) {

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
    const LatitudeAdjustmentVlaue = `&latitudeAdjustmentMethod=${this.GetSelectedValue('LatitudeAdjustmentId')}`;

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

    const d = new Date();
    let year = d.getFullYear();
    let monthe = d.getMonth() + 1;

    const addressValue = `?address=${address}`;

    let url = `${UrlResource.PrayTime_Url}${year}/${monthe}${addressValue}${methode}${methodSettings}${school}${LatitudeAdjustmentVlaue}${tune}`;
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
    this.utilities.SetElementStyle('spinnerLoadId', 'display', "");

    GeolocationService.getCityName().then(output => {
      this.callAladhanApi(output);
      this.CityName = output;

      this.utilities.SetElementStyle('spinnerLoadId', 'display', "none");
    });
  }
}
