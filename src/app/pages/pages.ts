import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-pages',
  standalone: true,  // ← IMPORTANTE
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './pages.html',
  styleUrl: './pages.css'
})
export class Pages {
  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  logout(): void {
    this.usuarioService.logout();
    this.router.navigate(['/login']);
  }
}