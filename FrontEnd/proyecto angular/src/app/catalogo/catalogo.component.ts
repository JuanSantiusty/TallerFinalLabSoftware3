import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Categoria } from '../categorias/modelos/categoria';
import { categoriaService } from '../categorias/servicios/categoria.service';

import { Producto } from '../productos/modelos/Producto';
import { ProductoService } from '../productos/servicios/Producto.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {

  // Datos
  public categorias: Categoria[] = [];
  public productos: Producto[] = [];
  public productosFiltrados: Producto[] = [];

  // Filtro
  public categoriaSeleccionada: number | 'Todo' = 'Todo';

  constructor(
    private categoriaSrv: categoriaService,
    private productoSrv: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  private cargarCategorias(): void {
    this.categoriaSrv.getCategorias().subscribe({
      next: (cats) => this.categorias = cats ?? [],
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  private cargarProductos(): void {
    this.productoSrv.getProductos().subscribe({
      next: (prods) => {
        // Normaliza disponible a boolean por seguridad
        this.productos = (prods ?? []).map(p => ({ ...p, estado: !!p.estado }));
        this.aplicarFiltro();
      },
      error: (err) => console.error('Error cargando productos:', err)
    });
  }

  onCategoriaChange(): void {
    this.aplicarFiltro();
  }

  getImageUrl(imagenNombre: string): string {
    return this.productoSrv.getImageUrl(imagenNombre);
  }

  private aplicarFiltro(): void {
  let lista = this.productos.filter(p => p.estado === true); // ← solo disponibles

  if (this.categoriaSeleccionada !== 'Todo') {
    const idCat = Number(this.categoriaSeleccionada);
    lista = lista.filter(p => p.objCategoria?.id === idCat);
  }

  this.productosFiltrados = [...lista];
}

  onImgError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/images/Fondo.jfif';
  img.onerror = null; // evita loops en caso extremo
}

}
