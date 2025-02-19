import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentRoute: string = '';  // Variable para almacenar la URL actual

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de navegación
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;  // Actualizar la URL actual
      }
    });
  }
}
