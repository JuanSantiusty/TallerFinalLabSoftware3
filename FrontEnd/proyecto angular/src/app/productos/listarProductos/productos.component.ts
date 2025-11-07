import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { Producto } from '../modelos/Producto';
import { ProductoService } from '../servicios/Producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, SweetAlert2Module],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {

  productos: Producto[] = [];
  cargando = false;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  private listar(): void {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (productos) => { this.productos = productos ?? []; this.cargando = false; },
      error: (err) => { console.error('Error listando productos:', err); this.cargando = false; }
    });
  }

  editarProducto(id: number): void {
    this.router.navigate(['/productos/editarProducto', id]);
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Desea eliminar este producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            this.productos = this.productos.filter(p => p.id !== id);
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
          },
          error: (err) => console.error('Error eliminando:', err)
        });
      }
    });
  }

  /** Activar/Desactivar disponibilidad sin abrir el formulario */
  toggleDisponibilidad(p: Producto): void {
    const dto = {
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      idCategoria: p.objCategoria?.id ?? 0,
      disponible: !p.disponible,
      imagen: null
    };

    this.productoService.update(dto as any).subscribe({
      next: (resp) => {
        p.disponible = dto.disponible; // reflejar en UI
        Swal.fire(
          'Actualizado',
          `El producto ahora está ${p.disponible ? 'Disponible' : 'No disponible'}.`,
          'success'
        );
      },
      error: (err) => console.error('Error al cambiar disponibilidad:', err)
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) { img.src = 'assets/images/Fondo.jfif'; img.onerror = null; }
  }

  getImageUrl(imagenNombre: string): string {
    return this.productoService.getImageUrl(imagenNombre);
  }

  trackById(index: number, item: Producto): number {
    return item.id;
  }
}
