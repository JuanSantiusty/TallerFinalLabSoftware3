import { Categoria } from "../../categorias/modelos/categoria";

export class Producto {
  id!: number;
  nombre!: string;
  descripcion!: string;
  precio!: number; 
  imagen!: string;
  objCategoria: Categoria | null = null; 
}