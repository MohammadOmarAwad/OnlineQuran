import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DateService } from '../Services/Date.Service';
import { StringResource } from '../Resources/StringResource';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrls: ['../app.component.scss', './header.component.scss']
})

export class HeaderComponent implements OnInit {
  Strings = StringResource;
  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';
  date: String = "";
  hijridate: String = "";

  constructor(private router: Router) { }

  //Run on Start
  ngOnInit() {
    this.getDates();
  }

  //Navitgate to Page
  gotoPage(page: String): void {
    this.router.navigate([page]);
    this.closeMenu();
  }

  //Open Menu
  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }

  //Close Menu
  closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

  //Set Date
  getDates() {
    this.date = DateService.GetDate();

    const RLE = '\u202B';  // Right-to-Left Embedding
    const PDF = '\u202C';  // Pop Directional Formatting
    this.hijridate = RLE + DateService.GetHijriDate() + PDF;
  }
}
