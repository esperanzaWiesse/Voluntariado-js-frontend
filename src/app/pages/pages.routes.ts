// src/app/pages/pages.routes.ts
import { Routes } from '@angular/router';
import { Pages } from './pages';
import { Dashboard } from './dashboard/dashboard';
import { Usuario } from './usuario/usuario';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, data: { titulo: 'Dashboard' } },
      { path: 'usuario', component: Usuario, data: { titulo: 'Usuario' } }
    ]
  }
];