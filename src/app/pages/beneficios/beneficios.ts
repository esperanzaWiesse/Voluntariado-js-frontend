import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../service/usuario.service';
import { ParticipanteService } from '../../service/participante.service';
import { ReporteParticipacion } from '../../models/partcipantes.model';
import { URL_SERVICIOS } from '../../config/config';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beneficios.html',
  styleUrl: './beneficios.css',
})
export class Beneficios implements OnInit {

  reporte: ReporteParticipacion | null = null;
  cargando: boolean = true;

  private usuarioService = inject(UsuarioService);
  private participanteService = inject(ParticipanteService);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit(): void {
    this.cargarReporte();
  }

  cargarReporte() {
    const usuario = this.usuarioService.usuario;

    console.log('Usuario en servicio:', usuario);

    if (!usuario || !usuario.idUsuario) {
      this.usuarioService.cargarStorage();
      if (this.usuarioService.usuario) {
        console.log('Usuario cargado de storage:', this.usuarioService.usuario);
        this.obtenerDatos(Number(this.usuarioService.usuario.idUsuario));
      } else {
        console.warn('No se encontró usuario logueado');
        Swal.fire('Error', 'No se ha identificado al usuario', 'error');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    } else {
      this.obtenerDatos(Number(usuario.idUsuario));
    }
  }

  obtenerDatos(idUsuario: number) {
    this.cargando = true;
    console.log('Solicitando reporte para usuario ID:', idUsuario);

    this.participanteService.obtenerReporteParticipacion(idUsuario).subscribe({
      next: (resp: any) => {
        console.log('Respuesta reporte:', resp);
        this.reporte = resp;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error obteniendo reporte:', err);
        this.cargando = false;
        this.cdr.detectChanges();
        Swal.fire('Error', 'No se pudo cargar el reporte de beneficios', 'error');
      }
    });
  }

  solicitarCertificado() {
    if (!this.reporte || !this.reporte.idUsuario) {
      Swal.fire('Error', 'No se ha identificado el usuario para generar el certificado', 'error');
      return;
    }

    Swal.fire({
      title: 'Generando Certificado',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.participanteService.descargarCertificado(this.reporte.idUsuario).subscribe({
      next: (blob: Blob) => {
        Swal.close();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');

        // Optional: revoke URL after some time to free memory, but beware if user refreshes the new tab immediately
        // setTimeout(() => window.URL.revokeObjectURL(url), 10000); 
      },
      error: (err) => {
        console.error('Error al descargar certificado:', err);
        Swal.fire('Error', 'No se pudo descargar el certificado', 'error');
      }
    });
  }
}
