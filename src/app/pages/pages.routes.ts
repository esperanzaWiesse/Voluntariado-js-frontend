// src/app/pages/pages.routes.ts
import { RouterModule, Routes } from '@angular/router';

import { LogingGuardGuard } from '../service/service.index';
import { Pages } from './pages';
import { Dashboard } from './dashboard/dashboard';
import { UsuarioUpdate } from './usuario/usuario';
import { Usuarios } from './usuario/usuarios';
import { Cargo } from './cargo/cargo';
import { CargoUpadate } from './cargo/cargo-upadate';
import { Actividad } from './actividad/actividad';
import { ActividadUpdate } from './actividad/actividad-update';
import { AdminGrupos } from './adminGrupos/admin-grupos';
import { AdminGruposUpadate } from './adminGrupos/admin-grupos-upadate';
import { Inscripciones } from './inscripciones/inscripciones';
import { InscripcionesUpdate } from './inscripciones/inscripciones-update';


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
      { path: 'usuario/:id', component: UsuarioUpdate, data: { titulo: 'Usuario' } },

      // Cargo
      { path: 'cargos', component: Cargo, data: { titulo: 'Mantenimiento de cargos' } },
      { path: 'cargo/:id', component: CargoUpadate, data: { titulo: 'Cargo' } },

      // Actividades
      { path: 'actividades', component: Actividad, data: { titulo: 'Mantenimiento de actividades' } },
      { path: 'actividad/:id', component: ActividadUpdate, data: { titulo: 'Actividad' } },

      // Admin Grupos
      { path: 'admin-grupos', component: AdminGrupos, data: { titulo: 'Administración de grupos' } },
      { path: 'admin-grupo/:id', component: AdminGruposUpadate, data: { titulo: 'Grupos de Voluntariado' } },

      // Inscripciones
      { path: 'inscripciones', component: Inscripciones, data: { titulo: 'Gestión de Inscripciones' } },
      { path: 'inscripcion/:id', component: InscripcionesUpdate, data: { titulo: 'Inscripcion' } },
    ]
  }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);