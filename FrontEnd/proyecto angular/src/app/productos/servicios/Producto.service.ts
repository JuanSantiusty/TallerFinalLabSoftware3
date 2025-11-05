import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Producto } from '../modelos/Producto';
import { ProductoDTO } from '../modelos/producto.dto';
// import { ErrorRetornado } from '../../excepciones/errorRetornado'; // <- solo si lo usas

@Injectable({ providedIn: 'root' })
export class ProductoService {

  // Para JSON (NO usar estos headers con FormData)
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Ajusta este endpoint a lo que tu back realmente expone
  // Si tu backend es /api/productos, cambia aquí:
  private urlEndPoint = 'http://localhost:5000/api/servicio';

  constructor(private http: HttpClient) {}

  /** === LISTAR === */
  getProductos(): Observable<Producto[]> {
    console.log('Listando productos desde el servicio');
    return this.http.get<Producto[]>(this.urlEndPoint)
      .pipe(catchError(this.handleError));
  }

  /** === OBTENER POR ID === */
  getProductoById(id: number): Observable<Producto> {
    console.log('Obteniendo producto con ID:', id);
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /** === CREAR === (multipart si hay imagen; JSON si no) */
  create(dto: ProductoDTO): Observable<Producto> {
    console.log('Creando producto desde el servicio');
    if (dto.imagen) {
      const form = this.toFormData(dto);
      // NO setear Content-Type para FormData
      return this.http.post<Producto>(this.urlEndPoint, form)
        .pipe(catchError(this.handleError));
    } else {
      return this.http.post<Producto>(this.urlEndPoint, dto, { headers: this.jsonHeaders })
        .pipe(catchError(this.handleError));
    }
  }

  /** === ACTUALIZAR === (PUT /servicio/{id}) */
  update(dto: ProductoDTO & { id: number }): Observable<Producto> {
    console.log('Actualizando producto desde el servicio', dto);
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
    console.log('Eliminando producto desde el servicio');
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /** === (Opcional) POR CATEGORÍA === */
  // Variante con query param (común en REST): /servicio?categoriaId=3
  getProductosPorCategoria(idCategoria: number): Observable<Producto[]> {
    console.log('Listando productos por categoría (query):', idCategoria);
    return this.http.get<Producto[]>(`${this.urlEndPoint}?categoriaId=${idCategoria}`)
      .pipe(catchError(this.handleError));
  }

  // Variante por path (si tu back expone /servicio/categoria/3)
  // getProductosPorCategoria(idCategoria: number): Observable<Producto[]> {
  //   console.log('Listando productos por categoría (path):', idCategoria);
  //   return this.http.get<Producto[]>(`${this.urlEndPoint}/categoria/${idCategoria}`)
  //     .pipe(catchError(this.handleError));
  // }

  // ---------- Helpers ----------

  private toFormData(dto: ProductoDTO | (ProductoDTO & { id?: number })): FormData {
    const form = new FormData();
    form.append('nombre', dto.nombre);
    form.append('descripcion', dto.descripcion);
    form.append('precio', String(dto.precio));
    form.append('idCategoria', String(dto.idCategoria));
    if ('id' in dto && dto.id != null) {
      form.append('id', String(dto.id));
    }
    if (dto.imagen) form.append('imagen', dto.imagen); // nombre exacto que espera tu back
    return form;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    // Intenta leer payload estándar de error del back
    const codigoError = error.error?.codigoError;
    const mensajeError = error.error?.mensaje || error.message || 'Error inesperado.';
    const codigoHttp  = error.error?.codigoHttp || error.status;
    const url         = error.error?.url || error.url;
    const metodo      = error.error?.metodo;

    console.error(`HTTP ${codigoHttp} ${metodo ?? ''} ${url ?? ''} -> ${mensajeError} (${codigoError ?? 's/e'})`);

    // SweetAlert amigable
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: mensajeError,
      confirmButtonText: 'Cerrar'
    });

    return throwError(() => new Error(mensajeError));
  };
}
