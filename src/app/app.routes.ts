import { Routes } from '@angular/router';
import { Login } from './login/login/login';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección desde raíz a login
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '/login' } // Cualquier ruta no encontrada va a login
];