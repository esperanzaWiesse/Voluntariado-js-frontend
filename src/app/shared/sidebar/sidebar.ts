import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService, Menu } from '../../service/sidebar.service';
import { UsuarioService } from '../../service/usuario.service';
import { Usuario } from '../../models/ususario.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  usuario: Usuario | null = null;
  menu: Menu[] = [];

  constructor(
    private _sidebarService: SidebarService,
    public _usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    
    // Cargar menú filtrado según el rol del usuario
    this.loadMenuByRole();
  }

  /**
   * Carga el menú según el rol del usuario
   */
  private loadMenuByRole(): void {
    const userRole = this.usuario?.rol || 'VISITANTE';
    this.menu = this._sidebarService.getMenuByrol(userRole);
    
    console.log('Usuario:', this.usuario);
    console.log('Rol:', userRole);
    console.log('Menú cargado:', this.menu);
  }

  /**
   * Toggle del menú
   */
  toggleMenu(menu: Menu): void {
    menu.expanded = !menu.expanded;
  }
}
