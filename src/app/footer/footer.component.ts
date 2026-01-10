import { Component } from '@angular/core';
import { RoutingHelper } from '../Services/RoutingHelper';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

    //Go to Map to find Masjid
    gotoLink(url: string): void {
      {
        if (!url) return;
  
        RoutingHelper.OpenTab(url);
      }
    }
}
