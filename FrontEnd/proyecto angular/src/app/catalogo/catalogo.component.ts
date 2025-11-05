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
        this.productos = prods ?? [];
        this.aplicarFiltro();
      },
      error: (err) => console.error('Error cargando productos:', err)
    });
  }

  onCategoriaChange(): void {
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    if (this.categoriaSeleccionada === 'Todo') {
      this.productosFiltrados = [...this.productos];
      return;
    }
    const idCat = Number(this.categoriaSeleccionada);
    this.productosFiltrados = this.productos.filter(p => p.objCategoria?.id === idCat);
  }
}
