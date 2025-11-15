import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { CommonModule } from '@angular/common';   // 👈 Importá CommonModule
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, CommonModule], // 👈 Agregalo acá
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  currentUrl: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });
  }

  isHome(): boolean {
    return this.currentUrl === '/' || this.currentUrl === '';
  }

  shouldHideNavbar(): boolean {
    return this.isHome() || this.currentUrl === '/resultado-revision';
  }

}
