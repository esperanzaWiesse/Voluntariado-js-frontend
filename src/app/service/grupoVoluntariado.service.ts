import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GrupoVoluntariadoModel } from '../models/grupoVoluntariado.model';
import { URL_SERVICIOS } from '../config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GrupoVoluntariadoService {

  constructor(private http: HttpClient) { }

  guardarGrupoVoluntariado(grupoVoluntariado: GrupoVoluntariadoModel): Observable<any> {
    let url = URL_SERVICIOS + '/grupoVoluntarios';

    console.log(grupoVoluntariado);

    if (grupoVoluntariado.idGrupoVoluntariado) {
      // actualizando
      url += '/' + grupoVoluntariado.idGrupoVoluntariado;
      return this.http.put(url, grupoVoluntariado).pipe(
        map((resp: any) => {
          Swal.fire('Grupo Voluntariado Actualizado', grupoVoluntariado.nombreGrupoVoluntariado, 'success');
          return resp.grupoVoluntariado;
        })
      );
    } else {
      // creando
      return this.http.post(url, grupoVoluntariado).pipe(
        map((resp: any) => {
          Swal.fire('Grupo Voluntariado Creado', grupoVoluntariado.nombreGrupoVoluntariado, 'success');
          return resp.grupoVoluntariado;
        })
      );
    }
  }

  cargarGrupoVoluntariados(): Observable<any> {
    const url = URL_SERVICIOS + '/grupoVoluntarios';
    return this.http.get(url);
  }

  cargarGrupoVoluntariado(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/grupoVoluntarios/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => resp.grupoVoluntario)
    );
  }

  desactivarGrupoVoluntariado(grupoVoluntariado: GrupoVoluntariadoModel): Observable<any> {
    const url = URL_SERVICIOS + '/grupoVoluntarios/delete/' + grupoVoluntariado.idGrupoVoluntariado;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        Swal.fire('Grupo Voluntariado Desactivado', grupoVoluntariado.nombreGrupoVoluntariado, 'success');
        return resp;
      })
    );
  }
}