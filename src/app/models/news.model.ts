export interface News {
  title: string;
  description: string;
  urlToImage?: string;
  source: {
    name: string;
  };
  publishedAt: string;
  isTranslated?: boolean; // Agrega esta propiedad
}