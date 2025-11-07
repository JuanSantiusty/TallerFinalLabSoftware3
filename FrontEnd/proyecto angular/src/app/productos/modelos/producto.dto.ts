// este dto me sirve para crear y actualizar productos
export interface ProductoDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  idCategoria: number;
  disponible: boolean;          
  imagen?: File | null;
}
