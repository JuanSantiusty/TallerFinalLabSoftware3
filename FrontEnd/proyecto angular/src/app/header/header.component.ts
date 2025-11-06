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

  isHome(): boolean {
    return this.router.url === '/' || this.router.url.startsWith('/catalogo');
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  roleButtonLabel(): string {
    return this.isAdmin() ? 'Vista Cliente' : 'Vista Administrador';
  }

  onRoleButtonClick(): void {
    const nextRole = this.auth.toggleRole();
    console.log('[Header] Switched to role:', nextRole);

    if (nextRole === 'admin') {
      this.router.navigateByUrl('/admin/productos')
        .catch(() => this.router.navigateByUrl('/productos/listarProductos')); // Alias antiguo
    } else {
      this.router.navigateByUrl('/catalogo');
    }
  }
}
