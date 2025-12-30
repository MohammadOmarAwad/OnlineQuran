import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import moment from 'moment-hijri';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';
  date: String = "";
  hijridate: String = "";

  constructor(private router: Router) { }

  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }

  gotoPage(page: String): void {
    this.router.navigate([page]);
    this.closeMenu();
  }

  closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

  ngOnInit() {
    this.getDates();
  }

  getDates() {
    this.date = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    const RLE = '\u202B';  // Right-to-Left Embedding
    const PDF = '\u202C';  // Pop Directional Formatting

    this.hijridate = RLE + moment().format('iD iMMMM iYYYY هـ') + PDF;
  }
}
