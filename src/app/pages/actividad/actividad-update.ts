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
export class ActividadUpdate implements OnInit{

  private fb = inject(FormBuilder);
    actividadSeleccionada: ActividadModel | null = null;
  
    formActividad = this.fb.group({
      nombre: ['', Validators.required],
      duracionhoras: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required]
    });

  ngOnInit() {
    const hoy = new Date().toISOString().substring(0, 10);
    this.formActividad.get('fecha')?.setValue(hoy);
  }

  constructor(
    public _actividadService: ActividadService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarActividad(id);
      }

    });
  }

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
      // console.log(this.actividadSeleccionada.idActi);
  
      // Enviar al servicio
          this._actividadService.guardarActividad(formValue)
            .subscribe({
              next: (resp) => {
                this.router.navigate(['/pages/actividades']);
              },
              error: (err) => {
                console.log(`error rrrr: ${err.error.errores[0]}`);
                Swal.fire('Error', `${err.error.errores[0]}`, 'error');
              }
            });
    }

}
