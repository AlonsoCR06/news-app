import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiKey = '401f840093e14cb38d8c7f4165f721d6'; // Reemplaza con tu clave de API de NewsAPI
  private baseUrl = 'https://newsapi.org/v2';

  constructor(private http: HttpClient) {}

  getTopStories(): Observable<any> {
    const url = `${this.baseUrl}/top-headlines?country=us&apiKey=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}
