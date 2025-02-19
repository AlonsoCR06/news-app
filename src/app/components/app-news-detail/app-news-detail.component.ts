import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news.model';  // Asegúrate de importar el modelo

@Component({
  selector: 'app-news-detail',
  templateUrl: './app-news-detail.component.html',
  styleUrls: ['./app-news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  newsTitle: string | null = null;  // Título de la noticia (slug)
  news: News | null | undefined = null;         // Permitir también 'undefined'
  isLoading: boolean = true;        // Indicador de carga

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    // Obtener el parámetro de la URL
    this.route.paramMap.subscribe(params => {
      this.newsTitle = params.get('slug');
      if (this.newsTitle) {
        this.fetchNewsDetails(this.newsTitle);  // Llamamos al método para obtener los detalles de la noticia
      }
    });
  }

  // Método para obtener los detalles de la noticia usando el 'slug'
  fetchNewsDetails(slug: string): void {
    this.newsService.getTopStories().subscribe(
      (data) => {
        // Buscar la noticia correspondiente con el slug
        this.news = data.articles.find(article => this.transformToSlug(article.title) === slug);
        this.isLoading = false;  // Cambiar el estado de carga a falso
      },
      (error) => {
        console.error('Error al obtener noticias:', error);
        this.isLoading = false;  // En caso de error, también cambiamos el estado de carga
      }
    );
  }

  // Método para convertir el título a slug
  transformToSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
