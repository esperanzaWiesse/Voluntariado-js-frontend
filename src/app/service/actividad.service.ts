import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActividadModel } from '../models/actividad.model';
import { URL_SERVICIOS } from '../config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  constructor(private http: HttpClient) { }

  guardarActividad(actividad: ActividadModel): Observable<any> {
    let url = URL_SERVICIOS + '/actividades';

    console.log(actividad.idActi);

    if (actividad.idActi) {
      // actualizando
      url += '/' + actividad.idActi;
      return this.http.put(url, actividad).pipe(
        map((resp: any) => {
          Swal.fire('Actividad Actualizada', actividad.nombre, 'success');
          return resp.actividad;
        })
      );
    } else {
      // creando
      return this.http.post(url, actividad).pipe(
        map((resp: any) => {
          Swal.fire('Actividad Creada', actividad.nombre, 'success');
          return resp.actividad;
        })
      );
    }
  }

  cargarActividades(): Observable<any> {
    const url = URL_SERVICIOS + '/actividades';
    return this.http.get(url);
  }

  cargarActividad(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/actividades/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => resp.actividad || resp.actividades[0])
    );
  }

  desactivarActividad(idGrupo: string, actividad: ActividadModel): Observable<any> {
    // Cambiar estado
    actividad.activo = !actividad.activo;
    let url = URL_SERVICIOS + `/actividades/grupo/${idGrupo}/actividad/` + actividad.idActi;

    return this.http.delete(url).pipe(
      map((resp: any) => {
        Swal.fire('Estado Actualizado', actividad.nombre, 'success');
        return resp;
      })
    );
  }
}