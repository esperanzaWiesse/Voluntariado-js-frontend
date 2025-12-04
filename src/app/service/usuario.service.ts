import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Usuario } from '../models/ususario.model';
import { URL_SERVICIOS } from '../config/config';
import Swal from 'sweetalert2';

// Interfaz para Fecha por que no esta definida en la tabla usuario
interface Fecha {
  fechInicioPer?: string;
  fechFinPer?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  usuario: Usuario | null = null;
  token: string = '';

  constructor(private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.cargarStorage();
  }

  cargarStorage() {
    if (this.isBrowser) {
      this.token = localStorage.getItem('token') || '';
      const usuarioStr = localStorage.getItem('usuario');
      this.usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    }
  }

  login(usuario: Usuario, recuerdame: boolean): Observable<any> {
    const url = `${URL_SERVICIOS}/auth/login`;
    
    const body = {
      email: usuario.email,
      password: usuario.password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, body, { headers }).pipe(
      tap((resp: any) => {
        if (resp.ok) {
          // Guardar en localStorage
          if (this.isBrowser) {
            if (recuerdame) {
              localStorage.setItem('email', usuario.email);
            } else {
              localStorage.removeItem('email');
            }
            
            localStorage.setItem('token', resp.token);
            localStorage.setItem('usuario', JSON.stringify(resp.usuario));
          }
          
          this.token = resp.token;
          this.usuario = resp.usuario;
        }
      })
    );
  }

  logout() {
    this.usuario = null;
    this.token = '';
    
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('email');
    }
  }

  estaLogueado(): boolean {
    return this.token.length > 5;
  }

  guardarUsuario(usuario: Usuario, fecha?: Fecha): Observable<any> {
    let url = URL_SERVICIOS + '/usuario';

    if (usuario.idUsuario) {
      // actualizando
      url += '/' + usuario.idUsuario;
      url += '?token=' + this.token;

      return this.http.put(url, usuario).pipe(
        map((resp: any) => {
          Swal.fire('Usuario Actualizado', usuario.nombre, 'success');
          return resp.usuario;
        })
      );
    } else {
      // creando
      url += '?token=' + this.token;

      return this.http.post(url, [usuario, fecha]).pipe(
        map((resp: any) => {
          Swal.fire('Usuario Creado', usuario.nombre, 'success');
          return resp.usuario;
        })
      );
    }
  }

  cargarUsuarios(): Observable<any> {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.get(url);
  }

  cargarUsuario(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/usuario/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => resp.usuario)
    );
  }

  buscarUsuarios(termino: string): Observable<Usuario[]> {
    const url = URL_SERVICIOS + '/busqueda/colleccion/usuarios/' + termino;
    return this.http.get(url).pipe(
      map((resp: any) => resp.usuarios)
    );
  }

  desactivarUsuario(usuario: Usuario): Observable<any> {
    let url = URL_SERVICIOS + '/usuario/delete/' + usuario.idUsuario;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        Swal.fire('Usuario Desactivado', usuario.nombre, 'success');
        return resp;
      })
    );
  }

}