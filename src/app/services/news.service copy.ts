import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiKey = '401f840093e14cb38d8c7f4165f721d6'; // Reemplaza con tu clave de API de NewsAPI
  private baseUrl = 'https://newsapi.org/v2';
  private cachedNews: any[] = []; // Almacenamos las noticias en caché
  private lastFetchTime: number | null = null; // Tiempo de la última actualización
  private cacheDuration = 24 * 60 * 60 * 1000; // Duración del caché: 24 horas en milisegundos

  constructor(private http: HttpClient) {}

  getTopStories(): Observable<any> {
    const now = Date.now();

    // Si las noticias están en caché y el tiempo de caché no ha expirado
    if (this.cachedNews.length > 0 && this.lastFetchTime && now - this.lastFetchTime < this.cacheDuration) {
      console.log('Usando noticias en caché');
      return of({ articles: this.cachedNews });
    }

    // Si no están en caché o el caché expiró, realizamos la solicitud a la API
    const url = `${this.baseUrl}/top-headlines?country=us&apiKey=${this.apiKey}`;
    console.log('Solicitando noticias nuevas de la API');
    return this.http.get<any>(url).pipe(
      tap((response) => {
        this.cachedNews = response.articles; // Guardamos las noticias en caché
        this.lastFetchTime = now; // Actualizamos el tiempo de la última actualización
      })
    );
  }
}
