import { Component } from '@angular/core';
import { StringResource } from '../../core/resources/StringResource';
import { RoutingService } from '../../core/services/Routing.Service';
import { UrlResource } from '../../core/resources/UrlResource';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['../../app.component.scss', './footer.component.scss']
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
