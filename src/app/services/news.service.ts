import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiKey = '401f840093e14cb38d8c7f4165f721d6';
  private baseUrl = 'https://newsapi.org/v2';

  constructor(private http: HttpClient) {}

  getTopStories(): Observable<{ articles: News[] }> {
    const url = `${this.baseUrl}/top-headlines?country=us&apiKey=${this.apiKey}`;
    return this.http.get<{ articles: News[] }>(url).pipe(
      map((response) => {
        // Filtrar artículos con contenido inválido
        response.articles = response.articles.filter(
          (article) =>
            article.title !== '[Removed]' &&
            article.description !== '[Removed]'
        );
        return response;
      })
    );
  }
}
