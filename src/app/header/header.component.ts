import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet,],
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

  gotoQuranPage(): void {
    this.router.navigate(['/quran', 1]);
    this.closeMenu();
  }

  gotoHomePage(): void {
    this.router.navigate(['/']);
    this.closeMenu();
  }

  gotoAboutPage(): void {
    this.router.navigate(['/about']);
    this.closeMenu();
  }

  gotostreamsPage(): void {
    this.router.navigate(['/streams']);
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
    this.hijridate = new Intl.DateTimeFormat('ar-SA-islamic-umalqura',{dateStyle:'long'}).format(new Date());
  }
}
