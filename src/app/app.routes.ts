import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsDetailComponent } from './components/app-news-detail/app-news-detail.component';
import { TopStoriesComponent } from './components/top-stories/top-stories.component';
import { InicioComponent } from './pages/inicio/inicio.component';


  const routes: Routes = [
    { path: 'inicio', component: InicioComponent }, // Página principal
    { path: 'news/:slug', component: NewsDetailComponent }, // Ruta dinámica para noticias
    { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Redirección a 'inicio' para la raíz
    { path: '**', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta comodín para manejar rutas no encontradas
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
