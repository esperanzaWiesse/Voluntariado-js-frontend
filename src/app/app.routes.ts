import { Routes } from '@angular/router';
import { Login } from './login/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.routes').then(m => m.pagesRoutes)
  },
  { path: '**', redirectTo: '/login' }
];