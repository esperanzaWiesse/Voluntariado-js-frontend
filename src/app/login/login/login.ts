import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../service/usuario.service';
import { Usuario } from '../../models/ususario.model';

declare function init_plugins(): any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  email: string = '';
  password: string = '';
  recuerdame: boolean = false;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && typeof init_plugins === 'function') {
      init_plugins();
    }
    
    // Solo accede a localStorage en el navegador
    if (this.isBrowser) {
      this.email = localStorage.getItem('email') || '';
      if (this.email.length > 1) {
        this.recuerdame = true;
      }
    }
  }

  ingresar(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const usuario = new Usuario(form.value.email, form.value.password);
    this._usuarioService.login(usuario, form.value.recuerdame)
      .subscribe(correcto => this.router.navigate(['/dashboard']));
  }

  onClose(): void {
    this.router.navigate(['/']);
  }

  onRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
}