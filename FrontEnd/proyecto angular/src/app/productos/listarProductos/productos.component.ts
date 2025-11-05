import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Producto } from '../modelos/Producto';                 // <- mantengo tu casing actual
import { ProductoService } from '../servicios/Producto.service'; // <- mantengo tu casing actual

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, SweetAlert2Module],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {

  productos: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        console.log('Listando productos...');
        this.productos = productos;
      },
      error: (err) => console.error('Error listando productos:', err)
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
        this.productoService.deleteProducto(id).subscribe(() => {
          this.productos = this.productos.filter(producto => producto.id !== id);
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        });
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }

  // Fallback para imagen rota: usa el recurso que sí tienes en /assets/images/
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.src = 'assets/images/Fondo.jfif'; // <- existe en tu proyecto
      img.onerror = null; // evita loops si por alguna razón también falla
    }
  }

  trackById(index: number, item: Producto) {
  return item.id;
}

}
