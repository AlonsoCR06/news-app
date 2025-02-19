import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';  // Importar el modelo

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiKey = '401f840093e14cb38d8c7f4165f721d6'; // Tu clave API
  private baseUrl = 'https://newsapi.org/v2';

  constructor(private http: HttpClient) {}

  // Modificar el tipo de retorno para usar el modelo News
  getTopStories(): Observable<{ articles: News[] }> {
    const url = `${this.baseUrl}/top-headlines?country=us&apiKey=${this.apiKey}`;
    return this.http.get<{ articles: News[] }>(url);
  }
}
