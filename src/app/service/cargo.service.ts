import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CargoModel } from '../models/cargo.model';
import { URL_SERVICIOS } from '../config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  
  constructor(private http: HttpClient) {}

  guardarCargo(cargo: CargoModel): Observable<any> {
    let url = URL_SERVICIOS + '/cargos';

    console.log(cargo);

    if (cargo.idCargo) {
      // actualizando
      url += '/' + cargo.idCargo;
      return this.http.put(url, cargo).pipe(
        map((resp: any) => {
          Swal.fire('Cargo Actualizado', cargo.nombreCargo, 'success');
          return resp.cargo;
        })
      );
    } else {
      // creando
      return this.http.post(url, cargo).pipe(
        map((resp: any) => {
          Swal.fire('Cargo Creado', cargo.nombreCargo, 'success');
          return resp.cargo;
        })
      );
    }
  }

  cargarCargos(): Observable<any> {
    const url = URL_SERVICIOS + '/cargos';
    return this.http.get(url);
  }

  cargarCargo(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/cargos/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => resp.cargos[0])
    );
  }

  desactivarCargo(cargo: CargoModel): Observable<any> {
    const url = URL_SERVICIOS + '/cargos/delete/' + cargo.idCargo;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        Swal.fire('Cargo Desactivado', cargo.nombreCargo, 'success');
        return resp;
      })
    );
  }
}