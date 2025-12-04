import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { Sidebar} from '../shared/sidebar/sidebar';
import { Header} from '../shared/header/header';

@Component({
  selector: 'app-pages',
  standalone: false,  // ← IMPORTANTE
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    Sidebar,
    Header
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