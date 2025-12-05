import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../service/service.index';
import { Usuario } from '../../models/ususario.model';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class UsuarioUpdate {

  private fb = inject(FormBuilder);
  usuarioSeleccionado: Usuario | null = null;

  formUsuario = this.fb.group({
    nombre: ['', Validators.required],
    apPaterno: ['', Validators.required],
    apMaterno: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    codUniversitario: ['', Validators.required],
    tipoCodUniversitario: ['', Validators.required],
    rol: ['', Validators.required]
  });

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarUsuario(id);
      }

    });
  }

  cargarUsuario(id: string) {
    this._usuarioService.cargarUsuario(id)
      .subscribe(usuario => {
        this.usuarioSeleccionado = usuario;
        this.formUsuario.patchValue(usuario);

        // En edición, la contraseña es opcional
        this.formUsuario.get('password')?.clearValidators();
        this.formUsuario.get('password')?.setValidators([Validators.minLength(6)]);
        this.formUsuario.get('password')?.updateValueAndValidity();

        // Limpiar campo de contraseña
        this.formUsuario.get('password')?.setValue('');
      });
  }

  guardar() {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      return;
    }

    const formValue = this.formUsuario.value;

    // Convertir DNI a número (si tiene valor)
    const dniNumber = formValue.dni ? Number(formValue.dni) : null;

    // Crear objeto usuario ya con dni en int
    const usuario: any = {
      ...formValue,
      dni: dniNumber   // <--- Aquí entra como número
    };

    // En edición, agregar ID y manejar pass vacío
    if (this.usuarioSeleccionado) {
      usuario.idUsuario = this.usuarioSeleccionado.idUsuario;

      if (!usuario.password) {
        delete usuario.password;
      }
    }

    console.log(usuario);

    // Enviar al servicio
    this._usuarioService.guardarUsuario(usuario)
      .subscribe({
        next: (resp) => {
          this.router.navigate(['/pages/usuarios']);
        },
        error: (err) => {
          console.log(`error rrrr: ${err.error.errores[0]}`);
          Swal.fire('Error', `${err.error.errores[0]}`, 'error');
        }
      });
  }
}
