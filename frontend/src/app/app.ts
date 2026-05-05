import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Article {
  _id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string | null;
}

interface ArticlePayload {
  titulo: string;
  descripcion: string;
  precio: number | null;
  categoria: string;
  imagen: File | null;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  readonly apiUrl = 'http://localhost:3800/api/articles';
  readonly imageBaseUrl = 'http://localhost:3800/articles/';

  articles: Article[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  form: ArticlePayload = this.getEmptyForm();

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<{ success: boolean; data: Article[] }>(this.apiUrl).subscribe({
      next: (response) => {
        this.articles = response.data ?? [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.error ?? 'No se pudieron cargar los artículos';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.imagen = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.createArticle();
  }

  private createArticle(): void {
    const formData = new FormData();
    formData.append('titulo', this.form.titulo);
    formData.append('descripcion', this.form.descripcion);
    formData.append('precio', String(this.form.precio ?? ''));
    formData.append('categoria', this.form.categoria);
    if (this.form.imagen) {
      formData.append('imagen', this.form.imagen);
    }

    this.http.post<{ success: boolean }>(this.apiUrl, formData).subscribe({
      next: () => {
        this.successMessage = 'Artículo creado correctamente';
        this.form = this.getEmptyForm();
        this.loadArticles();
      },
      error: (error) => {
        this.errorMessage = error?.error?.error ?? 'No se pudo crear el artículo';
      }
    });
  }

  getImageUrl(imageName: string | null): string {
    return imageName ? `${this.imageBaseUrl}${imageName}` : '';
  }

  private getEmptyForm(): ArticlePayload {
    return {
      titulo: '',
      descripcion: '',
      precio: null,
      categoria: '',
      imagen: null
    };
  }
}
