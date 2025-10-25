import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Cliente } from '../modelos/cliente';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Console } from 'node:console';
import { ErrorRetornado } from '../../excepciones/errorRetornado';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private urlEndPoint: string = 'http://localhost:5000/api/clientes';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    console.log("Listando clientes desde el servicio");
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  create(cliente: Cliente): Observable<Cliente> {
    console.log("Creando desde el servicio");
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(this.handleError)  
    );
  }   
  
  update(cliente: Cliente): Observable<Cliente> {
    console.log("Actualizando cliente desde el servicio", cliente);
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)  
    );
  }

  deleteCliente(id: number): Observable<void> {
    console.log("Eliminando cliente desde el servicio");
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)  
    ); 
  }

  getClienteById(id: number): Observable<Cliente> {
    console.log("Obteniendo cliente con ID:", id);
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400 || error.status ===404) { 
      const codigoError = error.error.codigoError;
      const mensajeError = error.error.mensaje;
      const codigoHttp = error.error.codigoHttp;
      const url = error.error.url;
      const metodo = error.error.metodo

      console.error(`Error ${codigoHttp} en ${metodo} ${url}: ${mensajeError} (Código: ${codigoError})`);
      
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: mensajeError, 
        confirmButtonText: 'Cerrar'
      });

      return throwError(() => new Error(mensajeError));
    } else {      
      return throwError(() => new Error('Ocurrió un error inesperado.'));
    }
  }
}

