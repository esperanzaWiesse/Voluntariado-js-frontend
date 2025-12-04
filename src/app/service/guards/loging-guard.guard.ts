import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';


@Injectable({
  providedIn: 'root'
})
export class LogingGuardGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
    ) { }

    canActivate() {

      if ( this._usuarioService.estaLogueado()) {
        console.log('paso');
        return true;
      }  else {
        console.log(' no paso');
        this.router.navigate(['/login']);
        return false;
      }
    }



}
