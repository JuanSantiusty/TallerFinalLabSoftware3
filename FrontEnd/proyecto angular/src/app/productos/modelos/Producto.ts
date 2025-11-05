import { Categoria } from "../../categorias/modelos/categoria";

export class Producto {
  id!: number;
  nombre!: string;
  descripcion!: string;
  precio!: number;
  objCategoria: Categoria | null = null;  
  imagen!: string;
}