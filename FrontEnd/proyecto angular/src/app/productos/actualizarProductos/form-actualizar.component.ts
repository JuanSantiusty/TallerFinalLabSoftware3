import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { Categoria } from '../../categorias/modelos/categoria';
import { categoriaService } from '../../categorias/servicios/categoria.service';
import { ProductoService } from '../servicios/Producto.service';  // o '../servicios/producto.service'
import { Producto } from '../modelos/Producto';
import { ProductoDTO } from '../modelos/producto.dto';

@Component({
  selector: 'app-form-actualizar',
  standalone: true,
  imports: [FormsModule, CommonModule, SweetAlert2Module, HttpClientModule, RouterLink],
  templateUrl: './form-actualizar.component.html',
  styleUrls: ['./form-actualizar.component.css']
})
export class FormActualizarComponent {

  public titulo = 'Actualizar producto';
  public categorias: Categoria[] = [];

  private productoId = 0;

  // Previews
  public previewActualUrl: string | null = null;              // imagen actual (URL del servidor)
  public previewNuevaUrl: string | ArrayBuffer | null = null; // imagen seleccionada

  // DTO que enviamos al back (incluye disponible)
  public producto: ProductoDTO = {
    nombre: '',
    descripcion: '',
    precio: 0,
    idCategoria: 0,
    estado: true,   // <- importante
    imagen: null
  };

  constructor(
    private categoriaSrv: categoriaService,
    private productoSrv: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.productoId = idParam ? +idParam : 0;

    this.categoriaSrv.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats ?? [];
        if (this.productoId) this.cargarProducto(this.productoId);
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  private cargarProducto(id: number): void {
    this.productoSrv.getProductoById(id).subscribe({
      next: (p: Producto) => {
        // Mapear Producto (del back) -> DTO (para editar)
        this.producto = {
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          idCategoria: p.objCategoria ? p.objCategoria.id : 0,
          estado: !!(p as any).disponible,  // <- boolean del back
          imagen: null                           // solo enviamos archivo si usuario cambia
        };

        // Preview de imagen actual, si tu back guarda el nombre de archivo
        this.previewActualUrl = p.imagen ? this.productoSrv.getImageUrl(p.imagen) : null;
        this.previewNuevaUrl = null; // limpia preview nueva al cargar
      },
      error: (err) => console.error('Error cargando producto:', err)
    });
  }

  // Manejo de archivo con vista previa (nueva)
  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.producto.imagen = file ?? null;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewNuevaUrl = reader.result;
      reader.readAsDataURL(file);
    } else {
      this.previewNuevaUrl = null;
    }
  }

  public actualizarProducto(): void {
    // Validaciones mínimas
    if (!this.producto.nombre?.trim()) {
      Swal.fire('Validación', 'El nombre es obligatorio', 'warning'); return;
    }
    if (!this.producto.descripcion?.trim()) {
      Swal.fire('Validación', 'La descripción es obligatoria', 'warning'); return;
    }
    if (!this.producto.precio || this.producto.precio <= 0) {
      Swal.fire('Validación', 'El precio debe ser mayor a 0', 'warning'); return;
    }
    if (!this.producto.idCategoria || this.producto.idCategoria <= 0) {
      Swal.fire('Validación', 'Selecciona una categoría', 'warning'); return;
    }

    this.productoSrv.update({ ...this.producto, id: this.productoId }).subscribe({
      next: (resp) => {
        Swal.fire('Producto actualizado', `Producto ${resp?.nombre ?? ''} actualizado con éxito!`, 'success');
        // Usa la ruta que tengas vigente
        this.router.navigate(['/productos/listarProductos']);
        // this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        // El handleError del service ya muestra SweetAlert si corresponde
      }
    });
  }
}
