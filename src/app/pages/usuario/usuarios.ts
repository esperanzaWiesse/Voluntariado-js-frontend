// import { Component } from '@angular/core';

import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { Usuario } from '../../models/ususario.model';
import { UsuarioService } from '../../service/service.index';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxPaginationModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  totalRegistros: number = 0;
  p: number = 1;
  cargando: boolean = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(public usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    // this.cargando = true;
    this.usuarioService.cargarUsuarios()
      .subscribe({
        next: (resp: any) => {
          // console.log('Respuesta del servicio:', resp);
          this.usuarios = resp.usuarios || [];

          // Normalizar datos para evitar errores de tipeo y visualización
          this.usuarios = this.usuarios.map(u => {
            const original = u.tipoCodUniversitario;
            const normalized = u.tipoCodUniversitario?.toLowerCase().trim() || '';

            if (normalized === 'estudante' || normalized === 'estudiante') {
              u.tipoCodUniversitario = 'Estudiante';
            } else if (normalized === 'administrador' || normalized === 'administrativo' || normalized.includes('admin')) {
              u.tipoCodUniversitario = 'Administrativo';
            } else if (normalized === 'docente') {
              u.tipoCodUniversitario = 'Docente';
            } else if (normalized === 'invitado') {
              u.tipoCodUniversitario = 'Invitado';
            }
            return u;
          });

          this.totalRegistros = this.usuarios.length;
          this.cdr.detectChanges();
          // this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
          this.cargando = false;
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los usuarios',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
  }

  buscarPersona(termino: string) {
    termino = termino.trim().toLowerCase();

    if (termino.length === 0) {
      this.cargarUsuarios();
      return;
    }

    this.usuarios = this.usuarios.filter(u =>
      `${u.nombre} ${u.apPaterno} ${u.apMaterno}`.toLowerCase().includes(termino) ||
      u.dni?.toString().includes(termino) ||
      u.email?.toLowerCase().includes(termino)
    );
  }

  desactivarUsuario(usuario: Usuario): void {
    const accion = usuario.activo ? 'desactivar' : 'activar';
    const titulo = usuario.activo ? 'desactivado' : 'activado';

    Swal.fire({
      title: `¿Estás seguro que deseas ${accion} al usuario?`,
      html: `<strong>${usuario.nombre} ${usuario.apPaterno}</strong>`,
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
        this.usuarioService.desactivarUsuario(usuario)
          .subscribe({
            next: () => {
              this.cargarUsuarios();
              Swal.fire({
                title: '¡Actualizado!',
                text: `El usuario ha sido ${titulo} correctamente.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (err) => {
              console.error('Error:', err);
              Swal.fire('Error', 'No se pudo cambiar el estado del usuario', 'error');
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

  // eliminarUsuario(usuario: Usuario): void {
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     html: `Esta acción eliminará permanentemente a:<br><strong>${usuario.nombre} ${usuario.apPaterno}</strong>`,
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar',
  //     reverseButtons: true,
  //     allowOutsideClick: false,
  //     customClass: {
  //       confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2',
  //       cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2'
  //     },
  //     buttonsStyling: false
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.usuarioService.eliminarUsuario(usuario.idUsuario!)
  //         .subscribe({
  //           next: () => {
  //             this.cargarUsuarios();
  //             Swal.fire({
  //               title: '¡Eliminado!',
  //               text: 'El usuario ha sido eliminado correctamente.',
  //               icon: 'success',
  //               timer: 2000,
  //               showConfirmButton: false
  //             });
  //           },
  //           error: (err: any) => {
  //             console.error('Error:', err);
  //             Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
  //           }
  //         });
  //     }
  //   });
  // }
}