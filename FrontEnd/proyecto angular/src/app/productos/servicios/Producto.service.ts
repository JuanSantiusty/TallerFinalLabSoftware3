import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Producto } from '../modelos/Producto';
import { ProductoDTO } from '../modelos/producto.dto';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  // Para JSON (NO usar estos headers con FormData)
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Ajusta según tu backend real
  private urlEndPoint = 'http://localhost:5000/api/servicio';
  private urlUploads  = 'http://localhost:5000/uploads';

  constructor(private http: HttpClient) {}

  /** === LISTAR === */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.urlEndPoint)
      .pipe(catchError(this.handleError));
  }

  /** === OBTENER POR ID === */
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /** === CREAR === (multipart si hay imagen; JSON si no) */
  create(dto: ProductoDTO): Observable<Producto> {
    if (dto.imagen) {
      const form = this.toFormData(dto);                   
      return this.http.post<Producto>(this.urlEndPoint, form)
        .pipe(catchError(this.handleError));
    } else {
      // 👇 importantísimo: incluir el boolean en JSON también
      return this.http.post<Producto>(this.urlEndPoint, dto, { headers: this.jsonHeaders })
        .pipe(catchError(this.handleError));
    }
  }
  /** === ACTUALIZAR === (PUT /servicio/{id}) */
  update(dto: ProductoDTO & { id: number }): Observable<Producto> {
    if (dto.imagen) {
      const form = this.toFormData(dto);                   
      return this.http.put<Producto>(`${this.urlEndPoint}/${dto.id}`, form)
        .pipe(catchError(this.handleError));
    } else {
      // Evitar enviar `imagen:null`
      const { imagen, ...json } = dto;                   
      return this.http.put<Producto>(`${this.urlEndPoint}/${dto.id}`, json, { headers: this.jsonHeaders })
        .pipe(catchError(this.handleError));
    }
  }

  /** === ELIMINAR === */
  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /** === (Opcional) POR CATEGORÍA === */
  getProductosPorCategoria(idCategoria: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndPoint}?categoriaId=${idCategoria}`)
      .pipe(catchError(this.handleError));
  }

  // ---------- Helpers ----------

  private toFormData(dto: ProductoDTO | (ProductoDTO & { id?: number })): FormData {
    const form = new FormData();
    form.append('nombre', dto.nombre);
    form.append('descripcion', dto.descripcion);
    form.append('precio', String(dto.precio));
    form.append('idCategoria', String(dto.idCategoria));
    form.append('disponible', String(dto.disponible));      // "true" | "false"

    if ('id' in dto && dto.id != null) {
      form.append('id', String(dto.id));
    }
    if (dto.imagen) {
      form.append('imagen', dto.imagen);                    // nombre exacto que espera tu back
    }
    return form;
  }

  getImageUrl(imagenNombre: string): string {
    if (!imagenNombre || imagenNombre.trim() === '') {
      return 'assets/images/Fondo.jfif';
    }
    return `${this.urlUploads}/${imagenNombre}`;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    const mensajeError = error.error?.mensaje || error.message || 'Error inesperado.';
    Swal.fire({ icon: 'error', title: '¡Error!', text: mensajeError, confirmButtonText: 'Cerrar' });
    return throwError(() => new Error(mensajeError));
  };
}
