import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { ParticipanteService } from '../../service/participante.service';
import { UsuarioService } from '../../service/usuario.service';
import { InscripcionService } from '../../service/inscripcion.service';
import { Participacion } from '../../models/partcipantes.model';
import { Usuario } from '../../models/ususario.model';

@Component({
  selector: 'app-participantes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './participantes.html',
  styleUrl: './participantes.css',
})
export class Participantes implements OnInit {

  participantes: Participacion[] = [];
  usuarios: Usuario[] = [];
  idActividad: number | null = null;
  idGrupo: number | null = null;
  totalRegistros: number = 0;
  p: number = 1;
  cargando: boolean = true;
  mostrarModal: boolean = false;

  formParticipacion: FormGroup;

  maxHoras: number = 0;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private participanteService: ParticipanteService,
    private usuarioService: UsuarioService,
    private inscripcionService: InscripcionService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formParticipacion = this.fb.group({
      idUsuario: ['', Validators.required],
      horasRealizadas: [0, [Validators.required, Validators.min(0)]],
      completado: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idActividad = +params['idActividad'];
      if (this.idActividad) {
        this.cargarParticipantes();
      }
    });

    this.route.queryParams.subscribe(params => {
      this.maxHoras = +params['horas'] || 0;
      this.idGrupo = +params['idGrupo'] || null;
      this.actualizarValidadores();

      if (this.idGrupo) {
        this.cargarUsuarios();
      } else {
        // If no group is specified, load all active users
        this.cargarUsuarios();
      }
    });
  }

  actualizarValidadores() {
    const horasControl = this.formParticipacion.get('horasRealizadas');
    if (horasControl) {
      horasControl.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(this.maxHoras)
      ]);
      horasControl.updateValueAndValidity();
    }
  }

  cargarParticipantes() {
    if (!this.idActividad) return;
    this.cargando = true;
    this.participanteService.obtenerParticipantes(this.idActividad).subscribe({
      next: (resp: any) => {
        this.participantes = resp.participantes || resp;
        this.totalRegistros = this.participantes.length;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarUsuarios() {
    if (this.idGrupo) {
      this.inscripcionService.obtenerMiembros(this.idGrupo).subscribe({
        next: (resp: any) => {
          if (!resp) {
            this.usuarios = [];
            return;
          }
          const miembros = resp.miembros || resp;
          if (Array.isArray(miembros)) {
            this.usuarios = miembros.map((m: any) => ({
              idUsuario: m.idUsuario,
              nombre: m.nombreUsuario,
              apPaterno: m.apPaterno,
              apMaterno: m.apMaterno,
              email: m.email,
              activo: m.activo,
              password: '' // Required by model
            })).filter((u: any) => u.activo);
          } else {
            this.usuarios = [];
          }
        },
        error: (err) => {
          console.error('Error al cargar miembros del grupo:', err);
          // Fallback or empty list
          this.usuarios = [];
        }
      });
    } else {
      this.usuarioService.cargarUsuarios().subscribe({
        next: (resp: any) => {
          if (!resp) {
            this.usuarios = [];
            return;
          }
          const usuarios = resp.usuarios || resp;
          if (Array.isArray(usuarios)) {
            this.usuarios = usuarios.filter((u: any) => u.activo);
          }
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
        }
      });
    }
  }

  abrirModal() {
    this.mostrarModal = true;
    this.formParticipacion.reset({ horasRealizadas: 0, completado: false });
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarParticipacion() {
    if (this.formParticipacion.invalid || !this.idActividad) return;

    const participacion: Participacion = {
      idActividad: this.idActividad,
      ...this.formParticipacion.value,
      idUsuario: Number(this.formParticipacion.value.idUsuario)
    };

    this.participanteService.registrarParticipacion(participacion).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarParticipantes();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo registrar la participación', 'error');
      }
    });
  }

  actualizarEstado(participante: Participacion) {
    if (!this.idActividad) return;

    const cambios = {
      horasRealizadas: participante.horasRealizadas,
      completado: !participante.completado // Toggle completado
    };

    this.participanteService.actualizarParticipacion(this.idActividad, participante.idUsuario, cambios).subscribe({
      next: () => {
        this.cargarParticipantes();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar', 'error');
      }
    });
  }

  actualizarHoras(participante: Participacion, nuevasHoras: string) {
    if (!this.idActividad) return;
    const horas = Number(nuevasHoras);
    if (isNaN(horas) || horas < 0) return;

    const cambios = {
      horasRealizadas: horas,
      completado: participante.completado
    };

    this.participanteService.actualizarParticipacion(this.idActividad, participante.idUsuario, cambios).subscribe({
      next: () => {
        // Opcional: mostrar toast
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar las horas', 'error');
      }
    });
  }

  eliminarParticipacion(participante: Participacion) {
    if (!this.idActividad) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará el registro de participación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.participanteService.eliminarParticipacion(this.idActividad!, participante.idUsuario).subscribe({
          next: () => {
            this.cargarParticipantes();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar', 'error');
          }
        });
      }
    });
  }
}
