import { Routes } from '@angular/router';

import { CatalogoComponent } from './catalogo/catalogo.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { CuponesComponent } from './cupones/cupones.component';
import { AyudaComponent } from './ayuda/ayuda.component';

// Admin productos (ya lo tienes)
import { ProductosComponent } from './productos/listarProductos/productos.component';
import { FormProductoComponent } from './productos/crearProductos/form.component';
import { FormActualizarComponent } from './productos/actualizarProductos/form-actualizar.component';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },

  // Público
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'ofertas',  component: OfertasComponent },
  { path: 'cupones',  component: CuponesComponent },
  { path: 'ayuda',    component: AyudaComponent },

  // Admin
  { path: 'admin/productos',          component: ProductosComponent },
  { path: 'admin/productos/crear',    component: FormProductoComponent },
  { path: 'admin/productos/editar/:id', component: FormActualizarComponent },
  { path: 'admin/ofertas',            component: OfertasComponent },
  { path: 'admin/cupones',            component: CuponesComponent },
  { path: 'admin/ayuda',              component: AyudaComponent },

  // Alias antiguos (si aún los usas en botones viejos)
  { path: 'productos/listarProductos',   component: ProductosComponent },
  { path: 'productos/crearProducto',     component: FormProductoComponent },
  { path: 'productos/editarProducto/:id',component: FormActualizarComponent },

  { path: '**', redirectTo: 'catalogo' }
];
