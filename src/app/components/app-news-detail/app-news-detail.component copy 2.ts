import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-detail',
  templateUrl: './app-news-detail.component.html',
  styleUrls: ['./app-news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  newsTitle: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el parámetro de la URL
    this.route.paramMap.subscribe(params => {
      this.newsTitle = params.get('slug');
    });
  }
}
