import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { TranslateService } from '../../services/translate.service';
import { TranslationStateService } from '../../services/translation-state.service';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-news-detail',
  templateUrl: './app-news-detail.component.html',
  styleUrls: ['./app-news-detail.component.scss'],
})
export class NewsDetailComponent implements OnInit {
  newsTitle: string | null = null;
  news: News | null = null;
  isLoading: boolean = true;
  isTranslating: boolean = false;
  originalNews: News | null = null; // Guarda la noticia original en inglés

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private translateService: TranslateService,
    private translationStateService: TranslationStateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.newsTitle = params.get('slug');
      if (this.newsTitle) {
        this.fetchNewsDetails(this.newsTitle);
      }
    });
  }

  fetchNewsDetails(slug: string): void {
    this.newsService.getTopStories().subscribe(
      (data) => {
        const article = data.articles.find((article) => this.transformToSlug(article.title) === slug);
        if (article) {
          // Verifica si la noticia ya está traducida
          const translatedStory = this.translationStateService.getTranslatedStory(article.title);
          if (translatedStory) {
            this.news = {
              ...article,
              title: translatedStory.translatedTitle,
              description: translatedStory.translatedDescription,
              isTranslated: true,
            };
          } else {
            this.news = { ...article, isTranslated: false };
          }
          this.originalNews = { ...article };
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener noticias:', error);
        this.isLoading = false;
      }
    );
  }

  transformToSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  translateNews(): void {
    if (!this.news || this.news.isTranslated || !this.originalNews) {
      console.log(`[NewsDetailComponent] La noticia "${this.news?.title}" ya está traducida. No se traducirá de nuevo.`);
      return;
    }
  
    this.isTranslating = true;
    this.translateService.translateText(this.news.title).subscribe(
      (response) => {
        if (this.news && this.originalNews) {
          const translatedTitle = response.translatedText;
          this.translateService.translateText(this.news.description).subscribe(
            (responseDesc) => {
              if (this.news) {
                const translatedDescription = responseDesc.translatedText;
  
                // Actualizar la noticia con la traducción
                this.news.title = translatedTitle;
                this.news.description = translatedDescription;
                this.news.isTranslated = true;
  
                // Guardar la traducción en el servicio usando el título original como clave
                const translatedStory = {
                  ...this.news,
                  translatedTitle: translatedTitle,
                  translatedDescription: translatedDescription,
                };
  
                // Verificación explícita para evitar el error
                if (this.originalNews) {
                  this.translationStateService.setTranslatedStory(translatedStory, this.originalNews.title);
                } else {
                  console.error('Error: originalNews es null');
                }
  
                this.isTranslating = false;
              }
            },
            (error) => {
              console.error('Error traduciendo descripción de noticia', error);
              this.isTranslating = false;
            }
          );
        }
      },
      (error) => {
        console.error('Error traduciendo título de noticia', error);
        this.isTranslating = false;
      }
    );
  }

  toggleTranslation(): void {
    if (!this.news || !this.originalNews) return;

    if (this.news.isTranslated) {
      // Restaurar la noticia original (inglés)
      this.news.title = this.originalNews.title;
      this.news.description = this.originalNews.description;
      this.news.isTranslated = false;

      // Eliminar la traducción del servicio
      this.translationStateService.removeTranslatedStory(this.originalNews.title);
    } else {
      // Traducir la noticia al español
      this.translateNews();
    }
  }
}