import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private apiUrl = 'https://libretranslate.com/translate'; // URL de tu API

  constructor(private http: HttpClient) {}

  translateText(text: string): Observable<any> {
    const params = new HttpParams()
      .set('q', text)
      .set('source', 'en') // Idioma de origen
      .set('target', 'es') // Idioma de destino
      .set('format', 'text') // Formato de texto
      .set('api_key', '2c53748a-543d-4bf1-abb9-ef5bf7512367'); // Tu API key

    // Realizamos la solicitud HTTP
    return this.http.post<any>(this.apiUrl, params).pipe(
      tap(response => {
        console.log('API Response:', response);
      }),
      catchError((error) => {
        console.error('Error en la solicitud', error);
        throw error;
      })
    );
  }
}
