import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Cambio aquí
import { AppComponent } from './app.component';
import { TopStoriesComponent } from './components/top-stories/top-stories.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { SlugifyPipe } from './pipes/slugify.pipe';
import { NewsDetailComponent } from './components/app-news-detail/app-news-detail.component';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { AppRoutingModule } from './app.routes'; 
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    TopStoriesComponent,
    InicioComponent,
    NewsDetailComponent,
    SlugifyPipe,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    // Ya no necesitas HttpClientModule
  ],
  providers: [
    provideHttpClient(), // Usamos provideHttpClient aquí
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
