import { Routes } from '@angular/router';
import { ProductosComponent } from './productos/listarProductos/productos.component';
import { FormProductoComponent } from './productos/crearProductos/form.component';
import { FormActualizarComponent } from './productos/actualizarProductos/form-actualizar.component';
import { CatalogoComponent } from './catalogo/catalogo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/productos/listarProductos', pathMatch: 'full' },

  // LISTAR
  { path: 'productos/listarProductos', component: ProductosComponent },

  // CREAR
  { path: 'productos/crearProducto', component: FormProductoComponent },

  // ACTUALIZAR
  { path: 'productos/editarProducto/:id', component: FormActualizarComponent },

  // CATÁLOGO
  { path: 'catalogo', component: CatalogoComponent },

  // WILDCARD
  { path: '**', redirectTo: '/productos/listarProductos' }
];
