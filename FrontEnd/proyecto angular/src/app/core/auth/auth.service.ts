import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Role = 'admin' | 'client';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private key = 'role';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  private safeLocalStorage(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

  getRole(): Role {
    if (this.safeLocalStorage()) {
      return (localStorage.getItem(this.key) as Role) || 'client';
    }
    return 'client';
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  setRole(role: Role): void {
    if (this.safeLocalStorage()) {
      localStorage.setItem(this.key, role);
    }
  }

  toggleRole(): Role {
    const newRole: Role = this.isAdmin() ? 'client' : 'admin';
    this.setRole(newRole);
    return newRole;
  }
}
