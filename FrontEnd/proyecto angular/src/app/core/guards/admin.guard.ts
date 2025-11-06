import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  private check(): boolean | UrlTree {
    const ok = this.auth.isAdmin();
    console.log('[AdminGuard] isAdmin =', ok, 'role =', this.auth.getRole());
    return ok ? true : this.router.parseUrl('/catalogo');
  }

  canActivate(): boolean | UrlTree { return this.check(); }
  canActivateChild(): boolean | UrlTree { return this.check(); }
}
