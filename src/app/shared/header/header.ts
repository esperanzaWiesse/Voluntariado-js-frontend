import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
  imports: [RouterLink]
})
export class Header {
  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  logout(): void {
    this.usuarioService.logout();
    this.router.navigate(['/login']);
  }
}
