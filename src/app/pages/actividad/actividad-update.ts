import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { ActividadService } from '../../service/service.index';
import { ActividadModel } from '../../models/actividad.model';

@Component({
  selector: 'app-actividad-update',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './actividad-update.html',
  styleUrl: './actividad-update.css',
})
export class ActividadUpdate implements OnInit {
  fb = inject(FormBuilder);
  actividadSeleccionada?: ActividadModel;
  formActividad = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    fecha: ['', Validators.required],
    duracionhoras: ['', Validators.required],
    activo: [true],
  });

  idGrupoVoluntariado?: string;

  ngOnInit() {
    const hoy = new Date().toISOString().substring(0, 10);
    this.formActividad.get('fecha')?.setValue(hoy);

    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarActividad(id);
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.idGrupoVoluntariado = params['idGrupo'];
    });
  }

  constructor(
    public _actividadService: ActividadService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  cargarActividad(id: string) {
    this._actividadService.cargarActividad(id).subscribe(actividad => {
      this.actividadSeleccionada = actividad;

      // Convertir la fecha ISO a formato yyyy-MM-dd para el input type="date"
      if (actividad.fecha) {
        const fechaFormateada = new Date(actividad.fecha).toISOString().substring(0, 10);
        actividad.fecha = fechaFormateada;
      }

      this.formActividad.patchValue(actividad);
    });
  }

  cancelar() {
    // Verificar si tenemos ID de grupo en queryParams o en la actividad seleccionada
    const idGrupo = this.idGrupoVoluntariado || this.actividadSeleccionada?.idGrupoVoluntariado;

    console.log('Cancelando. idGrupo:', idGrupo);

    if (idGrupo) {
      this.router.navigate(['/pages/admin-grupo', idGrupo]);
    } else {
      this.router.navigate(['/pages/actividades']);
    }

  }

  guardarActividad() {
    if (this.formActividad.invalid) {
      this.formActividad.markAllAsTouched();
      return;
    }

    const formValue: any = this.formActividad.value;

    // En edición, agregar ID y manejar pass vacío
    if (this.actividadSeleccionada) {
      formValue.idActi = this.actividadSeleccionada.idActi;
    }

    if (this.idGrupoVoluntariado) {
      formValue.idGrupoVoluntariado = this.idGrupoVoluntariado;
    }// console.log(this.actividadSeleccionada.idActi);

    // Enviar al servicio
    this._actividadService.guardarActividad(formValue)
      .subscribe({
        next: (resp) => {
          if (this.idGrupoVoluntariado) {
            this.router.navigate(['/pages/admin-grupo', this.idGrupoVoluntariado]);
          } else {
            this.router.navigate(['/pages/actividades']);
          }
        },
        error: (err) => {
          console.log(`error rrrr: ${err.error.errores[0]}`);
          Swal.fire('Error', `${err.error.errores[0]}`, 'error');
        }
      });
  }

}
