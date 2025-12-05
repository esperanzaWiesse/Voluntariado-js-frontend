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

  estaLogueado(): boolean {
    if (this.token.length > 5) {
      return true;
    }
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token && token.length > 5) {
        this.token = token;
        return true;
      }
    }
    return false;
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

  // guardando informacion del token en el localStorage
  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
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

  guardarUsuario(usuario: Usuario): Observable<any> {
    let url = URL_SERVICIOS + '/usuarios';

    if (usuario.idUsuario) {
      // actualizando
      console.log('actualizando usuario');
      url += '/' + usuario.idUsuario;
      console.log(url);

      return this.http.put(url, usuario, {
        headers: {
          'x-token': this.token
        }
      }).pipe(
        map((resp: any) => {
          Swal.fire('Usuario Actualizado', usuario.nombre, 'success');
          return resp.usuario;
        })
      );
    } else {
      console.log('creando usuario');
      // creando
      return this.http.post(url, { ...usuario }, {
        headers: {
          'x-token': this.token
        }
      }).pipe(
        map((resp: any) => {
          console.log('creando usuario');
          console.log(resp);
          Swal.fire('Usuario Creado', usuario.nombre, 'success');
          return resp.usuario;
        })
      );
    }
  }

  cargarUsuarios() {
    const url = URL_SERVICIOS + '/usuarios';
    return this.http.get(url, {
      headers: {
        'x-token': this.token
      }
    });
  }

  cargarUsuario(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/usuarios/' + id;
    return this.http.get(url, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => resp.usuarios[0])
    );
  }

  buscarUsuarios(termino: string): Observable<Usuario[]> {
    const url = URL_SERVICIOS + '/usuarios/busqueda' + termino;
    return this.http.get(url, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => resp.usuarios),
    );
  }

  desactivarUsuario(usuario: Usuario): Observable<any> {
    let url = URL_SERVICIOS + '/usuarios/delete/' + usuario.idUsuario;
    return this.http.put(url, usuario, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        Swal.fire('Usuario Desactivado', usuario.nombre, 'success');
        return resp;
      })
    );
  }

}