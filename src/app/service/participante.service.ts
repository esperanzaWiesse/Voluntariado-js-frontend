import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL_SERVICIOS } from '../config/config';
import Swal from 'sweetalert2';
import { Participacion } from '../models/partcipantes.model';

@Injectable({
    providedIn: 'root'
})
export class ParticipanteService {

    private apiUrl = URL_SERVICIOS + '/participacion';

    constructor(private http: HttpClient) { }

    registrarParticipacion(participacion: Participacion): Observable<any> {
        return this.http.post(`${this.apiUrl}/registrar`, participacion).pipe(
            map((resp: any) => {
                Swal.fire('Participación Registrada', 'El usuario ha sido registrado en la actividad', 'success');
                return resp;
            })
        );
    }

    actualizarParticipacion(idActividad: number, idUsuario: number, data: Partial<Participacion>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${idActividad}/${idUsuario}`, data).pipe(
            map((resp: any) => {
                Swal.fire('Actualización Exitosa', 'Los datos de participación han sido actualizados', 'success');
                return resp;
            })
        );
    }

    eliminarParticipacion(idActividad: number, idUsuario: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/eliminar/${idActividad}/${idUsuario}`).pipe(
            map((resp: any) => {
                Swal.fire('Eliminado', 'El registro de participación ha sido eliminado', 'success');
                return resp;
            })
        );
    }

    obtenerParticipantes(idActividad: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/participantes/${idActividad}`);
    }

    obtenerActividadesUsuario(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/usuario/${idUsuario}`);
    }

    obtenerReporteParticipacion(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/reporte/${idUsuario}`);
    }
}
