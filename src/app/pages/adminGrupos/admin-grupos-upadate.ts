import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { GrupoVoluntariadoModel } from '../../models/grupoVoluntariado.model';
import { GrupoVoluntariadoService } from '../../service/service.index';

import { Actividad } from '../actividad/actividad';

@Component({
  selector: 'app-admin-grupos-upadate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Actividad],
  templateUrl: './admin-grupos-upadate.html',
  styleUrl: './admin-grupos-upadate.css',
})
export class AdminGruposUpadate implements OnInit {

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  grupoSeleccionado: GrupoVoluntariadoModel | null = null;

  formGrupo = this.fb.group({
    nombreGrupoVoluntariado: ['', Validators.required],
    fechaCreacionGrupoVoluntariado: ['', Validators.required],
    duracionHoras: ['', Validators.required],
    duracionDias: ['', Validators.required],
    maxMiembros: ['', Validators.required],
    descripcion: ['', Validators.required],
  });

  ngOnInit() {
    const hoy = new Date().toISOString().substring(0, 10);
    this.formGrupo.get('fechaCreacionGrupoVoluntariado')?.setValue(hoy);

    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarGrupo(id);
      }
    });
  }

  constructor(
    public _grupoVoluntariadoService: GrupoVoluntariadoService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  cargarGrupo(id: string) {
    this._grupoVoluntariadoService.cargarGrupoVoluntariado(id).subscribe(grupo => {
      this.grupoSeleccionado = grupo;

      // Convertir la fecha ISO a formato yyyy-MM-dd para el input type="date"
      if (grupo.fechaCreacionGrupoVoluntariado) {
        const fechaFormateada = new Date(grupo.fechaCreacionGrupoVoluntariado).toISOString().substring(0, 10);
        grupo.fechaCreacionGrupoVoluntariado = fechaFormateada;
      }

      this.formGrupo.patchValue(grupo);
      this.cdr.detectChanges();
    });
  }

  guardarGrupo() {
    if (this.formGrupo.invalid) {
      this.formGrupo.markAllAsTouched();
      return;
    }

    let formValue: any = this.formGrupo.value;

    // En edición, mezclar con datos originales para no perder campos (ej: activo)
    if (this.grupoSeleccionado) {
      formValue = {
        ...this.grupoSeleccionado,
        ...formValue,
        idGrupoVoluntariado: this.grupoSeleccionado.idGrupoVoluntariado
      };
    }

    // Enviar al servicio
    this._grupoVoluntariadoService.guardarGrupoVoluntariado(formValue)
      .subscribe({
        next: (resp) => {
          this.router.navigate(['/pages/admin-grupos']);
        },
        error: (err) => {
          console.log(`error rrrr: ${err.error.errores[0]}`);
          Swal.fire('Error', `${err.error.errores[0]}`, 'error');
        }
      });
  }

}