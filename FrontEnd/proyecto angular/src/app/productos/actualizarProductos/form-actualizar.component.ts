import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Categoria } from '../../categorias/modelos/categoria';
import { categoriaService } from '../../categorias/servicios/categoria.service';
import { ProductoService } from '../servicios/Producto.service';     // mantengo tu casing
import { Producto } from '../modelos/Producto';                       // modelo del back
import { ProductoDTO } from '../modelos/producto.dto';                // DTO para enviar

@Component({
  selector: 'app-form-actualizar',
  standalone: true,
  imports: [FormsModule, CommonModule, SweetAlert2Module, HttpClientModule, RouterLink],
  templateUrl: './form-actualizar.component.html',
  styleUrls: ['./form-actualizar.component.css']
})
export class FormActualizarComponent {

  public titulo: string = 'Actualizar producto';
  public categorias: Categoria[] = [];

  // ID del producto que estamos editando
  private productoId: number = 0;

  // Vista previa de imagen (muestra la actual y la nueva si se cambia)
  public previewUrl: string | ArrayBuffer | null = null;

  // DTO para actualizar (el back acepta multipart si viene imagen)
  public producto: ProductoDTO = {
    nombre: '',
    descripcion: '',
    precio: 0,
    idCategoria: 0,
    imagen: null
  };

  constructor(
    private categoriaSrv: categoriaService,
    private productoSrv: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1) Tomar el id de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    this.productoId = idParam ? +idParam : 0;

    // 2) Cargar categorías y, cuando estén, cargar el producto
    this.categoriaSrv.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats;
        if (this.productoId) {
          this.cargarProducto(this.productoId);
        }
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  private cargarProducto(id: number): void {
    this.productoSrv.getProductoById(id).subscribe({
      next: (p: Producto) => {
        // Llenar el DTO desde el modelo que llega del back
        this.producto = {
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          idCategoria: p.objCategoria ? p.objCategoria.id : 0,
          imagen: null  // solo enviamos archivo si el usuario cambia
        };

        // Mostrar la imagen actual como preview
        this.previewUrl = p.imagen || null;
      },
      error: (err) => console.error('Error cargando producto:', err)
    });
  }

  // Manejo de archivo con vista previa
  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.producto.imagen = file ?? null;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  public actualizarProducto(): void {
    console.log('Actualizando producto', this.producto);

    // Validaciones básicas
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

    // PUT: si viene imagen -> multipart; si no -> JSON (según tu service)
    this.productoSrv.update({ ...this.producto, id: this.productoId }).subscribe({
      next: (resp) => {
        console.log('Producto actualizado exitosamente', resp);
        Swal.fire('Producto actualizado', `Producto ${resp.nombre} actualizado con éxito!`, 'success');
        this.router.navigate(['/productos/listarProductos']);   // ruta absoluta
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err?.message || err);
        // handleError del service ya muestra SweetAlert en 400/404
      }
    });
  }
}
