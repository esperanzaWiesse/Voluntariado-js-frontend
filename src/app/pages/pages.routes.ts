// src/app/pages/pages.routes.ts
import {RouterModule, Routes} from '@angular/router';

import { LogingGuardGuard } from '../service/service.index';
import { Pages } from './pages';
import { Dashboard } from './dashboard/dashboard';
import { Usuario } from './usuario/usuario';
import {Usuarios} from './usuario/usuarios';

export const pagesRoutes: Routes = [
  {
    path: '',
    component: Pages,
    canActivate: [LogingGuardGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, data: { titulo: 'Dashboard' } },

      // Usuarios
      { path: 'usuarios', component: Usuarios, data: { titulo: 'Mantenimiento de usuarios' } },
      {path: 'usuario/:id', component: Usuario, data: {titulo: 'Usuario'} },

    ]
  }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes);