import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { InscripcionService } from '../../service/inscripcion.service';
import { GrupoVoluntariadoService } from '../../service/grupoVoluntariado.service';
import { GrupoVoluntariadoModel } from '../../models/grupoVoluntariado.model';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgxPaginationModule],
  templateUrl: './inscripciones.html',
  styleUrl: './inscripciones.css',
})
export class Inscripciones implements OnInit {

  grupos: GrupoVoluntariadoModel[] = [];
  grupoSeleccionadoId: number | null = null;
  miembros: any[] = [];
  p: number = 1; // Paginación

  constructor(
    private inscripcionService: InscripcionService,
    private grupoService: GrupoVoluntariadoService
  ) { }

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos() {
    this.grupoService.cargarGrupoVoluntariados().subscribe((resp: any) => {
      this.grupos = resp.grupoVoluntarios || resp;
    });
  }

  cargarMiembros() {
    if (!this.grupoSeleccionadoId) {
      this.miembros = [];
      return;
    }

    this.inscripcionService.obtenerMiembros(this.grupoSeleccionadoId).subscribe({
      next: (resp: any) => {
        this.miembros = resp.miembros || resp; // Ajustar según respuesta del backend
      },
      error: (err) => {
        console.error(err);
        this.miembros = [];
      }
    });
  }

  darDeBaja(miembro: any) {
    if (!this.grupoSeleccionadoId) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de dar de baja a ${miembro.Usuario?.nombre || 'el usuario'} del grupo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja'
    }).then((result) => {
      if (result.isConfirmed) {

        // Asumiendo que miembro tiene idUsuario. Ajustar si es diferente.
        const idUsuario = miembro.idUsuario || miembro.Usuario?.idUsuario;

        this.inscripcionService.darDeBajaUsuario(this.grupoSeleccionadoId!, idUsuario).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El usuario ha sido dado de baja.', 'success');
            this.cargarMiembros(); // Recargar lista
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo dar de baja al usuario.', 'error');
          }
        });

      }
    });
  }
}
