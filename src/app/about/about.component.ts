import { Component } from '@angular/core';
import { Strings } from '../Resources/Strings';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['../app.component.css', './about.component.css']
})
export class AboutComponent {
  AboutTitle: String = Strings.About_Title;
  Information: String = Strings.About_Information;
  Vision: String = Strings.About_Vision;
}
