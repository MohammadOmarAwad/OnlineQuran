import { Component } from '@angular/core';
import GeolocationProvider from '../Services/GeolocationProvider';
import { HttpClient } from '@angular/common/http';
import { Masjid, MasjidAddress, MasjidLocation, MasjidResponse } from '../Models/MasjidResponse';
import { CommonModule } from '@angular/common';
import { RoutingHelper } from '../Services/RoutingHelper';

@Component({
  selector: 'app-masjids',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masjids.component.html',
  styleUrls: ['../app.component.css', './masjids.component.css']
})
export class MasjidsComponent {
  public MasjidInfor: MasjidResponse;
  public CityName: String;
  public ErrorMessage: String;

  constructor(
    private http: HttpClient
  ) { }


  ngOnInit() {
    GeolocationProvider.getLocation().then((loc) => { this.callMasjidsApi(loc[0], loc[1]); });
    GeolocationProvider.getCityName().then(output => { this.CityName = output; });
  }

  //Call the ParyTime Athan
  callMasjidsApi(latitude: String, longitude: String) {
    const rad = 1000000;
    const url = `https://api.masjidnear.me/v1/masjids/search` + `?lat=${latitude}&lng=${longitude}&radius=${rad}/`;

    this.http.get<MasjidResponse>(url).subscribe(res => {

      if (res.status == "OK") {

        if (res.data.masjids.length > 0) {

          res.data.masjids.forEach(xx => { xx.masjidAddress.description = this.getAdress(xx.masjidAddress) });
          this.MasjidInfor = res;

        } else {

          this.ErrorMessage = "لا توجد مساجد";

        }

      }
    });
  }

  //Go to Map to find Masjid
  gotoMasjid(val: MasjidLocation): void {
    {
      if (!val) return;

      const url = `https://www.google.com/maps?q=${val.coordinates[1]},${val.coordinates[0]}`;
      RoutingHelper.OpenTab(url);
    }
  }

  //Get the Address
  getAdress(val: MasjidAddress): string {
    return val.street.trim() ? val.street.trim() :
      val?.city?.trim() ? val?.city?.trim() :
        val?.country.trim() ? val?.country?.trim() :
          val?.state.trim() ? val?.state.trim() :
            val.description.trim();
  }
}
