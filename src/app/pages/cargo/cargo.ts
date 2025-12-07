import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { CargoModel } from '../../models/cargo.model';
import { CargoService } from '../../service/service.index';

@Component({
  selector: 'app-cargo',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxPaginationModule],
  templateUrl: './cargo.html',
  styleUrl: './cargo.css',
})
export class Cargo implements OnInit{
  cargos: CargoModel[] = [];
  totalRegistros: number = 0;
  p: number = 1;
  cargando: boolean = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(public cargoService: CargoService) { }

  ngOnInit(): void {
    this.cargarCargos();
  }

  cargarCargos(): void {
    // this.cargando = true;
    this.cargoService.cargarCargos()
      .subscribe({
        next: (resp: any) => {
          // console.log('Respuesta del servicio:', resp);
          this.cargos = resp.cargos || [];
          this.totalRegistros = this.cargos.length;
          this.cdr.detectChanges();
          // this.cargando = false;
        },
        error: (err: any) => {
          console.error('Error al cargar los cargos:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los cargos',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
  }

  desactivarCargo(cargo: CargoModel): void {
    const accion = cargo.activo ? 'desactivar' : 'activar';
    const titulo = cargo.activo ? 'desactivado' : 'activado';
    
        Swal.fire({
          title: `¿Estás seguro que deseas ${accion} al cargo?`,
          html: `<strong>${cargo.nombreCargo}</strong>`,
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
            this.cargoService.desactivarCargo(cargo)
              .subscribe({
                next: () => {
                  this.cargarCargos();
                  Swal.fire({
                    title: '¡Actualizado!',
                    text: `El cargo ha sido ${titulo} correctamente.`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                  });
                },
                error: (err: any) => {
                  console.error('Error:', err);
                  Swal.fire('Error', 'No se pudo cambiar el estado del cargo', 'error');
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
