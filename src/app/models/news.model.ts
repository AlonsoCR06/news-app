export interface News {
  title: string;
  description: string;
  publishedAt: string;
  source: { name: string };
  url?: string;
  urlToImage?: string;  // Nueva propiedad opcional para la imagen
}
