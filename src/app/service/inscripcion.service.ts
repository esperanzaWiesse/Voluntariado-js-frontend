import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inscripcion } from '../models/inscripcion.model';
import { URL_SERVICIOS } from '../config/config';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class InscripcionService {

    private apiUrl = URL_SERVICIOS + '/inscripciones';

    constructor(private http: HttpClient) { }

    inscribirUsuario(inscripcion: Inscripcion): Observable<any> {
        return this.http.post(`${this.apiUrl}/inscribir`, inscripcion).pipe(
            map((resp: any) => {
                Swal.fire('Inscripción Exitosa', 'El usuario ha sido inscrito correctamente', 'success');
                return resp;
            })
        );
    }

    actualizarCargo(idGrupo: number, idUsuario: number, idCargo: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${idGrupo}/${idUsuario}`, { idCargo }).pipe(
            map((resp: any) => {
                Swal.fire('Cargo Actualizado', 'El cargo del usuario ha sido actualizado', 'success');
                return resp;
            })
        );
    }

    darDeBajaUsuario(idGrupo: number, idUsuario: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${idGrupo}/${idUsuario}`).pipe(
            map((resp: any) => {
                Swal.fire('Usuario Dado de Baja', 'El usuario ha sido eliminado del grupo', 'success');
                return resp;
            })
        );
    }

    obtenerMiembros(idGrupo: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/miembros/${idGrupo}`);
    }

    obtenerGruposUsuario(idUsuario: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`);
    }
}
