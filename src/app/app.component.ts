import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainBodyComponent } from './features/main-body/main-body.component';
import { DataService } from './core/services/Data.Service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, MainBodyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  async ngOnInit() {
    await DataService.GetAyasData(); // preload
    await DataService.GetSurahsData(); // preload
    await DataService.GetRecitersData(); // preload
    await DataService.GetTafsersData(); // preload
    await DataService.GetQuranicWordsData(); // preload
  }
}
