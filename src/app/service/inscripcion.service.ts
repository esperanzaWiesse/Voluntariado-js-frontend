import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscripcion } from '../models/inscripcion.model';

@Injectable({
    providedIn: 'root'
})
export class InscripcionService {

    private apiUrl = 'http://localhost:3000/api/inscripciones'; // Ajustar URL base si es necesario

    constructor(private http: HttpClient) { }

    inscribirUsuario(inscripcion: Inscripcion): Observable<any> {
        return this.http.post(`${this.apiUrl}`, inscripcion);
    }

    actualizarCargo(idGrupo: number, idUsuario: number, idCargo: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${idGrupo}/${idUsuario}`, { idCargo });
    }

    darDeBajaUsuario(idGrupo: number, idUsuario: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${idGrupo}/${idUsuario}`);
    }

    obtenerMiembros(idGrupo: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/miembros/${idGrupo}`);
    }

    obtenerGruposUsuario(idUsuario: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`);
    }
}
