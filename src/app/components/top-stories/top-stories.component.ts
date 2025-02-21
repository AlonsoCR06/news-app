import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { TranslateService } from '../../services/translate.service'; // Importar servicio de traducción

@Component({
  selector: 'app-top-stories',
  templateUrl: './top-stories.component.html',
  styleUrls: ['./top-stories.component.scss'],
})
export class TopStoriesComponent implements OnInit {
  topStories: any[] = []; // Noticias en español (incluyendo la noticia principal)
  originalTopStories: any[] = []; // Noticias en inglés (incluyendo la noticia principal)
  isLoading: boolean = true;
  isTranslating: boolean = false;
  translatedHeader: string = '';
  originalHeader: string = "What You’re Reading";

  constructor(
    private newsService: NewsService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.fetchTopStories();
  }

  fetchTopStories(): void {
    this.newsService.getTopStories().subscribe(
      (data) => {
        const articles = data.articles;
        if (articles.length > 0) {
          // Agregar la noticia principal al principio del arreglo
          this.originalTopStories = articles;
          this.topStories = [...this.originalTopStories].map(story => ({
            ...story, isTranslated: false
          }));
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener noticias:', error);
        this.isLoading = false;
      }
    );
  }

  translateStory(story: any, index: number): void {
    this.isTranslating = true;
    this.translateService.translateText(story.title).subscribe(
      (response) => {
        this.topStories[index].title = response.translatedText;
        this.topStories[index].isTranslated = true;
        this.isTranslating = false;
      },
      (error) => {
        console.error('Error traduciendo título de noticia', error);
        this.isTranslating = false;
      }
    );
  }

  toggleTranslation(story: any, index: number): void {
    if (this.topStories[index].isTranslated) {
      // Volver a la versión original
      this.topStories[index].title = this.originalTopStories[index].title;
      this.topStories[index].isTranslated = false;
    } else {
      // Traducir al español
      this.translateStory(story, index);
    }
  }

  toggleHeaderTranslation(): void {
    if (this.translatedHeader) {
      this.translatedHeader = '';
    } else {
      this.translateService.translateText(this.originalHeader).subscribe(
        (response) => {
          this.translatedHeader = response.translatedText;
        },
        (error) => {
          console.error('Error traduciendo el encabezado', error);
        }
      );
    }
  }
}
