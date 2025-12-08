import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../service/usuario.service';
import { ParticipanteService } from '../../service/participante.service';
import { ReporteParticipacion } from '../../models/partcipantes.model';

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
    // Obtener usuario logueado
    const usuario = this.usuarioService.usuario; // Usar propiedad directa si ya se cargó en login/storage

    console.log('Usuario en servicio:', usuario);

    if (!usuario || !usuario.idUsuario) {
      // Si no está en memoria, intentar cargarlo del storage si hay token
      this.usuarioService.cargarStorage();
      if (this.usuarioService.usuario) {
        console.log('Usuario cargado de storage:', this.usuarioService.usuario);
        this.obtenerDatos(Number(this.usuarioService.usuario.idUsuario));
      } else {
        // Redirigir a login o mostrar error
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
        // La respuesta puede venir directa o dentro de una propiedad, segun el user endpoint:
        // { "ok": true, "idUsuario": ..., ... } -> Esto parece ser el objeto directo
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
    Swal.fire({
      title: 'Solicitud Enviada',
      text: 'Se ha enviado tu solicitud de certificado a la administración.',
      icon: 'success'
    });
  }
}
