import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { TranslateService } from '../../services/translate.service'; // Importa el servicio de traducción
import { News } from '../../models/news.model';

@Component({
  selector: 'app-news-detail',
  templateUrl: './app-news-detail.component.html',
  styleUrls: ['./app-news-detail.component.scss']
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
    private translateService: TranslateService // Inyecta el servicio de traducción
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.newsTitle = params.get('slug');
      if (this.newsTitle) {
        this.fetchNewsDetails(this.newsTitle);
      }
    });
  }

  fetchNewsDetails(slug: string): void {
    this.newsService.getTopStories().subscribe(
      (data) => {
        const article = data.articles.find(article => this.transformToSlug(article.title) === slug);
        if (article) {
          this.news = { ...article, isTranslated: false }; // Inicializa la noticia con isTranslated en false
          this.originalNews = { ...article }; // Guarda la noticia original
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
    if (!this.news) return;

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
    } else {
      // Traducir la noticia
      this.translateNews();
    }
  }
}