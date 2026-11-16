import { Component } from '@angular/core';
import { StringResource } from '../../core/resources/StringResource';
import { QuranHistory } from '../../core/resources/QuranHistory';
import { UtiltitiesService } from '../../core/services/Utiltities.Service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['../../app.component.scss', './about.component.scss']
})
export class AboutComponent {
  Strings = StringResource;
  QuranChain = QuranHistory.aymanSuwaydQuranChain;

  constructor(
    private utilities: UtiltitiesService
  ) { }

  //Run on Strat
  ngOnInit() {
    this.utilities.SetElementStyle('spinnerLoadId', 'display', "none");
  }
}
