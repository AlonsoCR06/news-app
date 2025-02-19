import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private translateUrl = 'https://libretranslate.de/translate';

  constructor(private http: HttpClient) {}

  translate(text: string, targetLanguage: string, sourceLanguage = 'en'): Observable<string> {
    const body = {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format: 'text',
    };

    return this.http.post<any>(this.translateUrl, body).pipe(
      map((response) => response.translatedText)
    );
  }
}
