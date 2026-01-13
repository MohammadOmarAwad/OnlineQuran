import { Component } from '@angular/core';
import { StringResource } from '../Resources/StringResource';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['../app.component.scss', './about.component.scss']
})
export class AboutComponent {
  AboutTitle: String = StringResource.About_Title;
  AboutVisionTitle: String = StringResource.About_VisionTitle;
  Information: String = StringResource.About_Information;
  Vision: String = StringResource.About_Vision;
}
