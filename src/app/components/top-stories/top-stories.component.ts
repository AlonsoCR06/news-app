import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { TranslateService } from '../../services/translate.service';
import { TranslationStateService } from '../../services/translation-state.service'; // Importa el servicio
import { News } from '../../models/news.model'; // Importa el modelo News

@Component({
  selector: 'app-top-stories',
  templateUrl: './top-stories.component.html',
  styleUrls: ['./top-stories.component.scss'],
})
export class TopStoriesComponent implements OnInit {
  topStories: News[] = []; // Noticias en español
  originalTopStories: News[] = []; // Noticias originales en inglés
  visibleStories: News[] = []; // Noticias que se muestran en col-3
  remainingStories: News[] = []; // Noticias restantes
  isLoading: boolean = true;
  isTranslating: boolean = false;
  translatedHeader: string = '';
  originalHeader: string = "What You’re Reading";
  storiesPerLoad: number = 4; // Cuántas noticias se cargan cada vez

  constructor(
    private newsService: NewsService,
    private translateService: TranslateService,
    private translationStateService: TranslationStateService // Inyecta el servicio
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
          this.topStories = articles.map((story) => {
            // Verifica si la noticia ya está traducida
            const translatedStory = this.translationStateService.getTranslatedStory(story.title);
            return translatedStory ? translatedStory : { ...story, isTranslated: false };
          });
          this.initializeStories(); // Inicializa las noticias visibles
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
    // Mostrar las primeras 4 noticias en col-3
    this.visibleStories = this.remainingStories.splice(0, this.storiesPerLoad);
  }

  loadMore(): void {
    const nextStories = this.remainingStories.splice(0, this.storiesPerLoad);
    this.visibleStories = [...this.visibleStories, ...nextStories];
  }

  translateStory(story: News, index: number): void {
    if (story.isTranslated) {
      console.log(`[TopStoriesComponent] La noticia "${story.title}" ya está traducida. No se traducirá de nuevo.`);
      return;
    }

    this.isTranslating = true;
    this.translateService.translateText(story.title).subscribe(
      (response) => {
        const translatedTitle = response.translatedText;
        this.translateService.translateText(story.description).subscribe(
          (responseDesc) => {
            const translatedDescription = responseDesc.translatedText;

            // Guardar la traducción en el servicio
            const translatedStory = {
              ...story,
              translatedTitle: translatedTitle,
              translatedDescription: translatedDescription,
              isTranslated: true,
            };
            this.translationStateService.setTranslatedStory(translatedStory);

            // Actualizar la noticia en la lista
            this.topStories[index] = translatedStory;

            // Actualizar visibleStories si la noticia traducida está en ella
            const visibleIndex = this.visibleStories.findIndex(s => s.title === story.title);
            if (visibleIndex !== -1) {
              this.visibleStories[visibleIndex] = translatedStory;
            }

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

  toggleTranslation(story: News, index: number): void {
    if (this.topStories[index].isTranslated) {
      // Restaurar la noticia original (inglés)
      this.topStories[index].title = this.originalTopStories[index].title;
      this.topStories[index].description = this.originalTopStories[index].description;
      this.topStories[index].translatedTitle = this.originalTopStories[index].title; // Restaurar translatedTitle
      this.topStories[index].translatedDescription = this.originalTopStories[index].description; // Restaurar translatedDescription
      this.topStories[index].isTranslated = false;
  
      // Actualizar el servicio con la noticia restaurada
      const restoredStory = {
        ...this.topStories[index],
        translatedTitle: this.originalTopStories[index].title,
        translatedDescription: this.originalTopStories[index].description,
      };
      this.translationStateService.setTranslatedStory(restoredStory);
  
      // Actualizar visibleStories si la noticia restaurada está en ella
      const visibleIndex = this.visibleStories.findIndex(s => s.title === story.title);
      if (visibleIndex !== -1) {
        this.visibleStories[visibleIndex] = restoredStory;
      }
    } else if (!this.topStories[index].isTranslated && this.topStories[index].title === this.originalTopStories[index].title) {
      // Si la noticia ya está en inglés, no hacer nada
      console.log(`[TopStoriesComponent] La noticia "${story.title}" ya está en inglés. No se traducirá.`);
    } else {
      // Traducir la noticia al español
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