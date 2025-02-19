import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NewsService } from '../services/news.service'; // Asegúrate de ajustar la ruta correctamente
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsResolver implements Resolve<any> {
  private cachedStories: any[] = [];

  constructor(private newsService: NewsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | any {
    const slug = route.paramMap.get('slug');
    if (this.cachedStories.length === 0) {
      return this.newsService.getTopStories().toPromise().then((data) => {
        this.cachedStories = data.articles; // Cacheamos las noticias
        return this.cachedStories.find((story) => this.generateSlug(story.title) === slug);
      });
    } else {
      return this.cachedStories.find((story) => this.generateSlug(story.title) === slug);
    }
  }

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
