import { Injectable } from '@angular/core';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root', // Disponible en toda la aplicación
})
export class TranslationStateService {
  private translatedStories: { [key: string]: News } = {}; // Almacena las traducciones

  /**
   * Obtiene una noticia traducida si existe.
   * @param title Título de la noticia (clave para buscar la traducción).
   * @returns La noticia traducida o `null` si no existe.
   */
  getTranslatedStory(title: string): News | null {
    const translatedStory = this.translatedStories[title] || null;
    console.log(
      `[TranslationStateService] Buscando traducción para: "${title}"`,
      translatedStory ? "Encontrada" : "No encontrada"
    );
    return translatedStory;
  }

  /**
   * Guarda una noticia traducida.
   * @param news Noticia traducida.
   */
  setTranslatedStory(news: News): void {
    console.log(
      `[TranslationStateService] Guardando traducción para: "${news.title}"`,
      news
    );
    this.translatedStories[news.title] = news; // Usa el título original como clave
  }

  /**
   * Verifica si una noticia ya ha sido traducida.
   * @param title Título de la noticia.
   * @returns `true` si la noticia está traducida, `false` en caso contrario.
   */
  isTranslated(title: string): boolean {
    const isTranslated = !!this.translatedStories[title];
    console.log(
      `[TranslationStateService] Verificando si "${title}" está traducida:`,
      isTranslated
    );
    return isTranslated;
  }
}