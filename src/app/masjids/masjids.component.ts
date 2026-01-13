import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasjidAddress, MasjidLocation, MasjidResponse } from '../Models/MasjidResponse';
import { CommonModule } from '@angular/common';
import { GeolocationService } from '../Services/Geolocation.Service';
import { RoutingService } from '../Services/Routing.Service';
import { StringResource } from '../Resources/StringResource';
import { UrlResource } from '../Resources/UrlResource';

@Component({
  selector: 'app-masjids',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masjids.component.html',
  styleUrls: ['../app.component.scss', './masjids.component.scss']
})

export class MasjidsComponent {
  Strings = StringResource;
  public MasjidInfor: MasjidResponse;
  public CityName: String;
  public ErrorMessage: String;

  constructor(
    private http: HttpClient
  ) { }

  //Run On Start
  ngOnInit() {
    GeolocationService.getLocation().then((loc) => { this.callMasjidsApi(loc[0], loc[1]); });
    GeolocationService.getCityName().then(output => { this.CityName = output; });
  }

  //Call the ParyTime Athan
  callMasjidsApi(latitude: String, longitude: String) {
    const rad = 1000000;
    const url = `${UrlResource.Masjidnear_Url}` + `?lat=${latitude}&lng=${longitude}&radius=${rad}/`;

    this.http.get<MasjidResponse>(url).subscribe(res => {

      if (res.status == "OK") {

        if (res.data.masjids.length > 0) {

          res.data.masjids.forEach(xx => { xx.masjidAddress.description = this.getAdress(xx.masjidAddress) });
          this.MasjidInfor = res;

        } else {

          this.ErrorMessage = StringResource.Massjid_Error;

        }

      }
    });
  }

  //Go to Map to find Masjid
  gotoMasjid(val: MasjidLocation): void {
    {
      if (!val) return;

      const url = `${UrlResource.GoogleMap_Url}?q=${val.coordinates[1]},${val.coordinates[0]}`;
      RoutingService.OpenTab(url);
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