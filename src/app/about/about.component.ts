import { Component } from '@angular/core';
import { StringResource } from '../Resources/StringResource';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['../app.component.css', './about.component.css']
})
export class AboutComponent {
  AboutTitle: String = StringResource.About_Title;
  Information: String = StringResource.About_Information;
  Vision: String = StringResource.About_Vision;
}
