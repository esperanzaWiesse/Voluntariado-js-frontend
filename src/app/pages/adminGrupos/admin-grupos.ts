
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { GrupoVoluntariadoModel } from '../../models/grupoVoluntariado.model';
import { GrupoVoluntariadoService } from '../../service/service.index';

@Component({
  selector: 'app-admin-grupos',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxPaginationModule],
  templateUrl: './admin-grupos.html',
  styleUrl: './admin-grupos.css',
})
export class AdminGrupos implements OnInit {

  grupoVoluntariados: GrupoVoluntariadoModel[] = [];
  totalRegistros: number = 0;
  p: number = 1;
  cargando: boolean = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(public grupoVoluntariadoService: GrupoVoluntariadoService) { }

  ngOnInit(): void {
    this.cargarGrupoVoluntariado();
  }

  cargarGrupoVoluntariado(): void {
    this.grupoVoluntariadoService.cargarGrupoVoluntariados()
      .subscribe({
        next: (resp: any) => {
          if (resp.grupoVoluntario) {
            this.grupoVoluntariados = [resp.grupoVoluntario];
          } else {
            this.grupoVoluntariados = resp.grupoVoluntariados || [];
          }
          this.totalRegistros = this.grupoVoluntariados.length;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar grupos de voluntariado:', err);
          this.cargando = false;
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los grupos de voluntariado',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
  }

  buscarGrupoVoluntariado(termino: string) {
    termino = termino.trim().toLowerCase();

    if (termino.length === 0) {
      this.cargarGrupoVoluntariado();
      return;
    }

    this.grupoVoluntariados = this.grupoVoluntariados.filter(u =>
      `${u.nombreGrupoVoluntariado}`.toLowerCase().includes(termino) ||
      u.maxMiembros?.toString().includes(termino) ||
      u.idGrupoVoluntariado?.toLowerCase().includes(termino)
    );
  }

  desactivarGrupoVoluntariado(grupoVoluntariado: GrupoVoluntariadoModel): void {
    const accion = grupoVoluntariado.activo ? 'desactivar' : 'activar';
    const titulo = grupoVoluntariado.activo ? 'desactivado' : 'activado';

    Swal.fire({
      title: `¿Estás seguro que deseas ${accion} al grupo de voluntariado?`,
      html: `<strong>${grupoVoluntariado.nombreGrupoVoluntariado} $</strong>`,
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
        this.grupoVoluntariadoService.desactivarGrupoVoluntariado(grupoVoluntariado)
          .subscribe({
            next: () => {
              this.cargarGrupoVoluntariado();
              Swal.fire({
                title: '¡Actualizado!',
                text: `El grupo de voluntariado ha sido ${titulo} correctamente.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (err: any) => {
              console.error('Error:', err);
              Swal.fire('Error', 'No se pudo cambiar el estado del grupo de voluntariado', 'error');
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

}
