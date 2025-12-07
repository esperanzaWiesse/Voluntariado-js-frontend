import { Component, OnInit, ChangeDetectorRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { ActividadModel } from '../../models/actividad.model';
import { ActividadService } from '../../service/service.index';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxPaginationModule],
  templateUrl: './actividad.html',
  styleUrl: './actividad.css',
})
export class Actividad implements OnInit {
  @Input() idGrupoVoluntariado?: string;

  actividades: ActividadModel[] = [];
  totalRegistros: number = 0;
  p: number = 1;
  cargando: boolean = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(public actividadService: ActividadService) { }

  ngOnInit(): void {
    this.cargarActividades()
  }

  cargarActividades(): void {
    // this.cargando = true;
    this.actividadService.cargarActividades()
      .subscribe({
        next: (resp: any) => {
          // console.log('Respuesta del servicio:', resp);
          this.actividades = resp.actividades || [];

          // Filtrar si estamos en modo "dentro de grupo"
          if (this.idGrupoVoluntariado) {
            this.actividades = this.actividades.filter(a => a.idGrupoVoluntariado == this.idGrupoVoluntariado);
          }

          this.totalRegistros = this.actividades.length;
          this.cdr.detectChanges();
          // this.cargando = false;
        },
        error: (err: any) => {
          console.error('Error al cargar los actividades:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar las actividades',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
  }

  desactivarActividad(actividad: ActividadModel): void {
    const accion = actividad.activo ? 'desactivar' : 'activar';
    const titulo = actividad.activo ? 'desactivado' : 'activado';

    Swal.fire({
      title: `¿Estás seguro que deseas ${accion} a la actividad?`,
      html: `<strong>${actividad.nombre}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2',
        cancelButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.actividadService.desactivarActividad(this.idGrupoVoluntariado!, actividad)
          .subscribe({
            next: () => {
              this.cargarActividades();
              Swal.fire({
                title: '¡Actualizado!',
                text: `La actividad ha sido ${titulo} correctamente.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (err: any) => {
              console.error('Error:', err);
              Swal.fire('Error', 'No se pudo cambiar el estado de la actividad', 'error');
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelado',
          text: 'No se ha modificado el estado',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  truncateWords(text: string, limit: number = 8): string {
    if (!text) return '';

    const words = text.trim().split(/\s+/);

    if (words.length <= limit) {
      return text;
    }

    return words.slice(0, limit).join(' ') + '...';
  }

}
