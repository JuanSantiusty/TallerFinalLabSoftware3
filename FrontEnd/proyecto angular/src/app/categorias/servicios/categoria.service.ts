import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Categoria } from "../modelos/categoria";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class categoriaService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private urlEndPoint: string = 'http://localhost:5000/api/categorias';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    console.log("Listando categorias desde el servicio");
    return this.http.get<Categoria[]>(this.urlEndPoint);
  }

}

