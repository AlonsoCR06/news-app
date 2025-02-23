import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { TranslateService } from '../../services/translate.service';
import { TranslationStateService } from '../../services/translation-state.service'; // Importa el servicio
import { News } from '../../models/news.model'; // Importa el modelo News

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
    private translationStateService: TranslationStateService // Inyecta el servicio
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
    if (!this.news || this.news.isTranslated) {
      console.log(`[NewsDetailComponent] La noticia "${this.news?.title}" ya está traducida. No se traducirá de nuevo.`);
      return;
    }

    this.isTranslating = true;
    this.translateService.translateText(this.news.title).subscribe(
      (response) => {
        if (this.news) {
          this.news.title = response.translatedText;
          this.translateService.translateText(this.news.description).subscribe(
            (responseDesc) => {
              if (this.news) {
                this.news.description = responseDesc.translatedText;
                this.news.isTranslated = true;

                // Guardar la traducción en el servicio
                this.translationStateService.setTranslatedStory(this.news);
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
      // Restaurar la noticia original
      this.news.title = this.originalNews.title;
      this.news.description = this.originalNews.description;
      this.news.isTranslated = false;

      // Actualizar el servicio con la noticia restaurada
      this.translationStateService.setTranslatedStory(this.news);
    } else {
      // Traducir la noticia
      this.translateNews();
    }
  }
}