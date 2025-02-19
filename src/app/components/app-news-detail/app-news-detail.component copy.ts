import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-detail',
  template: `
    <h1>{{ newsTitle }}</h1>
    <p>{{ newsDescription }}</p>
    <a [href]="newsUrl" target="_blank">Leer más</a>
  `,
})
export class NewsDetailComponent implements OnInit {
  newsTitle: string = '';
  newsDescription: string = '';
  newsUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Captura el 'slug' de la URL
    const slug = this.route.snapshot.paramMap.get('slug');

    // Aquí debes usar el slug para obtener la noticia de la API o de algún servicio
    // Simulamos una llamada para obtener los datos de la noticia:
    if (slug) {
      this.newsTitle = `Detalle de la noticia: ${slug}`;
      this.newsDescription = `Descripción de la noticia relacionada con ${slug}`;
      this.newsUrl = 'https://example.com/news';  // Cambia esto con la URL real
    }
  }
}
