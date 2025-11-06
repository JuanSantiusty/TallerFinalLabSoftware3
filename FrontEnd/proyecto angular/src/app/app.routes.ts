import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { CuponesComponent } from './cupones/cupones.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { ProductosComponent } from './productos/listarProductos/productos.component';
import { FormProductoComponent } from './productos/crearProductos/form.component';
import { FormActualizarComponent } from './productos/actualizarProductos/form-actualizar.component';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },

  // Público
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'ofertas',  component: OfertasComponent },
  { path: 'cupones',  component: CuponesComponent },
  { path: 'ayuda',    component: AyudaComponent },

  // Admin (todas protegidas con canActivate)
  { path: 'admin', redirectTo: 'admin/productos', pathMatch: 'full' },
  { path: 'admin/productos',            component: ProductosComponent,        canActivate: [AdminGuard] },
  { path: 'admin/productos/crear',      component: FormProductoComponent,     canActivate: [AdminGuard] },
  { path: 'admin/productos/editar/:id', component: FormActualizarComponent,   canActivate: [AdminGuard] },
  { path: 'admin/ofertas',              component: OfertasComponent,          canActivate: [AdminGuard] },
  { path: 'admin/cupones',              component: CuponesComponent,          canActivate: [AdminGuard] },
  { path: 'admin/ayuda',                component: AyudaComponent,            canActivate: [AdminGuard] },

  // Alias antiguos (también protegidos)
  { path: 'productos/listarProductos',   component: ProductosComponent,        canActivate: [AdminGuard] },
  { path: 'productos/crearProducto',     component: FormProductoComponent,     canActivate: [AdminGuard] },
  { path: 'productos/editarProducto/:id',component: FormActualizarComponent,   canActivate: [AdminGuard] },

  { path: '**', redirectTo: 'catalogo' }
];
