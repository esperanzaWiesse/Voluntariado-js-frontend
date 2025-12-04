import { Injectable } from '@angular/core';

export interface Submenu {
  titulo: string;
  url?: string;
  roles?: string[]; // Roles permitidos para este submenú
}

export interface Menu {
  titulo: string;
  icono: string;
  submenu: Submenu[];
  roles?: string[]; // Roles permitidos para este menú
  expanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private menuCompleto: Menu[] = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      roles: ['ADMIN', 'VISITANTE'], // Visible para ambos roles
      submenu: [
        {
          titulo: 'Dashboard',
          url: '/dashboard',
          roles: ['ADMIN', 'VISITANTE']
        }
      ]
    },
    {
      titulo: 'Grupo de Voluntarios',
      icono: 'fa fa-address-card-o',
      roles: ['ADMIN', 'VISITANTE'],
      submenu: [
        {
          titulo: 'Inscripciones',
          url: '/preinscripciones',
          roles: ['ADMIN'] // Solo admin
        },
        {
          titulo: 'Administracion de grupos ',
          url: '/inscripciones',
          roles: ['ADMIN', 'VISITANTE'] // Ambos
        }
      ]
    },
    {
      titulo: 'Mantenimientos',
      icono: 'mdi mdi-folder-lock-open',
      roles: ['ADMIN'], // Solo admin ve este menú completo
      submenu: [
        { titulo: 'Usuarios', url: '/pages/usuario', roles: ['ADMIN'] },
        { titulo: 'Cargos', url: '/cargos', roles: ['ADMIN'] },
        { titulo: 'Tipos Grupo Gupos de Voluntarios', url: '/tipos-grupo-voluntarios', roles: ['ADMIN'] },
        { titulo: 'Actividades', url: '/actividades', roles: ['ADMIN'] }
      ]
    }
  ];

  constructor() { }

  /**
   * Filtra el menú según el rol del usuario
   * @param userRole - Rol del usuario actual
   * @returns Menú filtrado según permisos
   */
  getMenuByrol(userRole: string): Menu[] {
    return this.menuCompleto
      .filter(menu => this.hasAccess(menu.roles, userRole))
      .map(menu => ({
        ...menu,
        submenu: menu.submenu.filter(sub => this.hasAccess(sub.roles, userRole)),
        expanded: false
      }))
      .filter(menu => menu.submenu.length > 0); // Solo mostrar menús con submenús
  }

  /**
   * Verifica si el usuario tiene acceso
   * @param allowedRoles - Roles permitidos
   * @param userRole - Rol del usuario
   * @returns true si tiene acceso
   */
  private hasAccess(allowedRoles: string[] | undefined, userRole: string): boolean {
    if (!allowedRoles || allowedRoles.length === 0) {
      return true; // Si no hay roles definidos, es accesible para todos
    }
    return allowedRoles.includes(userRole);
  }
}