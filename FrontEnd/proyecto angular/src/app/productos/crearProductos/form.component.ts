import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { ProductoService } from '../servicios/Producto.service';   
import { ProductoDTO } from '../modelos/producto.dto';
import { Categoria } from '../../categorias/modelos/categoria';
import { categoriaService } from '../../categorias/servicios/categoria.service';

@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    SweetAlert2Module,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormProductoComponent {

  public titulo = 'Crear producto';
  public categorias: Categoria[] = [];
  public previewUrl: string | ArrayBuffer | null = null;

  // DTO crear/actualizar (con disponible)
  public producto: ProductoDTO = {
    nombre: '',
    descripcion: '',
    precio: 0,
    idCategoria: 0,
    estado: true,       // <- por defecto al crear
    imagen: null
  };

  constructor(
    private categoriaSrv: categoriaService,
    private productoSrv: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  private cargarCategorias(): void {
    this.categoriaSrv.getCategorias().subscribe({
      next: (cats) => this.categorias = cats ?? [],
      error: (err) => console.error('Error cargando categorías:', err)
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
    } else {
      this.previewUrl = null;
    }
  }

  public crearProducto(): void {
    console.log('Creando producto', this.producto);

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

    this.productoSrv.create(this.producto).subscribe({
      next: (response: any) => {
        console.log('Producto creado exitosamente', response);
        Swal.fire('Nuevo producto', `Producto ${response?.nombre ?? ''} creado con éxito!`, 'success');
        // usa el alias viejo o el nuevo según tus rutas
        this.router.navigate(['productos/listarProductos']); 
        // this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        Swal.fire('Error', 'No se pudo crear el producto', 'error');
      }
    });
  }
}
