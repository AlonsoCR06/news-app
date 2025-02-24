import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Lo provee en el nivel raíz para que esté disponible en toda la aplicación
})
export class LoggerService {
  private isLoggingEnabled: boolean = true; // Por defecto, los logs están habilitados

  constructor() {}

  // Método para habilitar o deshabilitar los logs
  setLoggingEnabled(enabled: boolean): void {
    this.isLoggingEnabled = enabled;
  }

  // Método para registrar logs
  log(...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.log(...args); // Solo muestra el log si está habilitado
    }
  }

  // Métodos adicionales para otros tipos de logs (opcional)
  warn(...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.error(...args);
    }
  }

  debug(...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.debug(...args);
    }
  }
}