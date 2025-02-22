import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-top-stories',
  templateUrl: './top-stories.component.html',
  styleUrls: ['./top-stories.component.scss'],
})
export class TopStoriesComponent implements OnInit {
  topStories: any[] = []; // Noticias en español
  originalTopStories: any[] = []; // Noticias originales en inglés
  visibleStories: any[] = []; // Noticias que se muestran en col-3
  remainingStories: any[] = []; // Noticias restantes
  isLoading: boolean = true;
  isTranslating: boolean = false;
  translatedHeader: string = '';
  originalHeader: string = "What You’re Reading";
  storiesPerLoad: number = 4; // Cuántas noticias se cargan cada vez

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
          this.originalTopStories = articles;
          this.topStories = [...this.originalTopStories].map(story => ({
            ...story, isTranslated: false
          }));
          this.initializeStories();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener noticias:', error);
        this.isLoading = false;
      }
    );
  }

  initializeStories(): void {
    // Noticias a partir de la séptima
    this.remainingStories = this.topStories.slice(6);
    // Mostrar las primeras 2 noticias en col-3
    this.visibleStories = this.remainingStories.splice(0, this.storiesPerLoad);
  }

  loadMore(): void {
    const nextStories = this.remainingStories.splice(0, this.storiesPerLoad);
    this.visibleStories = [...this.visibleStories, ...nextStories];
  }

  translateStory(story: any, index: number): void {
    this.isTranslating = true;
    this.translateService.translateText(story.title).subscribe(
      (response) => {
        this.topStories[index].title = response.translatedText;
        this.translateService.translateText(story.description).subscribe(
          (responseDesc) => {
            this.topStories[index].description = responseDesc.translatedText;
            this.topStories[index].isTranslated = true;
            this.isTranslating = false;
          },
          (error) => {
            console.error('Error traduciendo descripción de noticia', error);
            this.isTranslating = false;
          }
        );
      },
      (error) => {
        console.error('Error traduciendo título de noticia', error);
        this.isTranslating = false;
      }
    );
  }

  toggleTranslation(story: any, index: number): void {
    if (this.topStories[index].isTranslated) {
      this.topStories[index].title = this.originalTopStories[index].title;
      this.topStories[index].description = this.originalTopStories[index].description;
      this.topStories[index].isTranslated = false;
    } else {
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