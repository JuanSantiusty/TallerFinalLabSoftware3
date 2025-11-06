import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router, private auth: AuthService) {}

  isHome() { return this.router.url === '/' || this.router.url.startsWith('/catalogo'); }
  isAdmin() { return this.auth.isAdmin(); }
  roleButtonLabel() { return this.isAdmin() ? 'Vista Cliente' : 'Vista Administrador'; }

  onRoleButtonClick(): void {
    const next = this.auth.toggleRole();
    console.log('[Header] switched to', next);
    if (next === 'admin') {
      this.router.navigateByUrl('/admin/productos').then(ok => {
        if (!ok) this.router.navigateByUrl('/productos/listarProductos'); // alias viejo, por si acaso
      });
    } else {
      this.router.navigateByUrl('/catalogo');
    }
  }
}
