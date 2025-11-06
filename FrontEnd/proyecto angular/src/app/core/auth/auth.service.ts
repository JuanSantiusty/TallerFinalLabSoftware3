import { Injectable } from '@angular/core';

export type Role = 'admin' | 'client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'role';

  getRole(): Role {
    return (localStorage.getItem(this.key) as Role) || 'client';
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  setRole(role: Role) {
    localStorage.setItem(this.key, role);
  }

  toggleRole(): Role {
    const next: Role = this.isAdmin() ? 'client' : 'admin';
    this.setRole(next);
    return next;
  }
}
