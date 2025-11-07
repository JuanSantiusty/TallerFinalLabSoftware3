import { Categoria } from "../categorias/modelos/categoria";

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    estado: boolean;
    objCategoria: Categoria;
}