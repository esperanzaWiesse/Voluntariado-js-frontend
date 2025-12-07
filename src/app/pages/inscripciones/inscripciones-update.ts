import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { InscripcionService } from '../../service/inscripcion.service';
import { GrupoVoluntariadoService } from '../../service/grupoVoluntariado.service';
import { UsuarioService } from '../../service/usuario.service';
import { CargoService } from '../../service/cargo.service';

import { Inscripcion } from '../../models/inscripcion.model';
import { GrupoVoluntariadoModel } from '../../models/grupoVoluntariado.model';
import { Usuario } from '../../models/ususario.model';
import { CargoModel } from '../../models/cargo.model';

@Component({
  selector: 'app-inscripciones-update',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './inscripciones-update.html',
  styleUrl: './inscripciones-update.css',
})
export class InscripcionesUpdate implements OnInit {

  formInscripcion: FormGroup;

  grupos: GrupoVoluntariadoModel[] = [];
  usuarios: Usuario[] = [];
  cargos: CargoModel[] = [];

  constructor(
    private fb: FormBuilder,
    private inscripcionService: InscripcionService,
    private grupoService: GrupoVoluntariadoService,
    private usuarioService: UsuarioService,
    private cargoService: CargoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formInscripcion = this.fb.group({
      idGrupoVoluntariado: ['', Validators.required],
      idUsuario: ['', Validators.required],
      idCargo: ['', Validators.required],
      fechaInscripcion: [new Date().toISOString().split('T')[0], Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.cargarListas();
  }

  cargarListas() {
    this.grupoService.cargarGrupoVoluntariados().subscribe((resp: any) => {
      const grupos = resp.grupoVoluntarios || resp;
      this.grupos = grupos.filter((g: any) => g.activo);
    });

    this.usuarioService.cargarUsuarios().subscribe((resp: any) => {
      const usuarios = resp.usuarios || resp;
      this.usuarios = usuarios.filter((u: any) => u.activo);
    });

    this.cargoService.cargarCargos().subscribe((resp: any) => {
      const cargos = resp.cargos || resp;
      this.cargos = cargos.filter((c: any) => c.activo);
    });
  }

  guardarInscripcion() {
    if (this.formInscripcion.invalid) {
      return;
    }

    const inscripcion: Inscripcion = this.formInscripcion.value;

    // Convertir IDs a números si vienen como strings del select
    inscripcion.idGrupoVoluntariado = Number(inscripcion.idGrupoVoluntariado);
    inscripcion.idUsuario = Number(inscripcion.idUsuario);
    inscripcion.idCargo = Number(inscripcion.idCargo);

    this.inscripcionService.inscribirUsuario(inscripcion).subscribe({
      next: (resp) => {
        Swal.fire('Inscripción Exitosa', 'El usuario ha sido inscrito correctamente.', 'success');
        this.router.navigate(['/pages/inscripciones']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo realizar la inscripción.', 'error');
      }
    });
  }
}
