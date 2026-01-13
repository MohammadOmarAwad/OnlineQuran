import { Component } from '@angular/core';
import { RoutingService } from '../Services/Routing.Service';
import { UrlResource } from '../Resources/UrlResource';
import { StringResource } from '../Resources/StringResource';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['../app.component.css', './footer.component.css']
})
export class FooterComponent {

  URLS = UrlResource;
  FooterInfo: String = StringResource.App_Title;

  //Go to Map to find Masjid
  gotoLink(url: string): void {
    {
      if (!url) return;

      RoutingService.OpenTab(url);
    }
  }
}
