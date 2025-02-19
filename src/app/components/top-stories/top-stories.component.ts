import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service'; // Servicio para obtener noticias

@Component({
  selector: 'app-top-stories',
  templateUrl: './top-stories.component.html',
  styleUrls: ['./top-stories.component.scss'],
})
export class TopStoriesComponent implements OnInit {
  topStories: any[] = []; // Almacenamos las noticias más leídas
  mainStory: any = null; // Almacenamos la noticia principal
  isLoading: boolean = true; // Indicador de carga

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.fetchTopStories(); // Llamamos al método que obtiene las noticias
  }

  fetchTopStories(): void {
    this.newsService.getTopStories().subscribe(
      (data) => {
        const articles = data.articles;
        if (articles.length > 0) {
          this.mainStory = articles[0]; // Asignamos la primera noticia como principal
          this.topStories = articles.slice(1, 6); // Las siguientes noticias serán "más leídas"
        }
        this.isLoading = false; // Cambiamos el estado de carga
      },
      (error) => {
        console.error('Error al obtener noticias:', error);
        this.isLoading = false; // Cambiamos el estado de carga en caso de error
      }
    );
  }
}
