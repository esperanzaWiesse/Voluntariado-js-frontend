import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {

  private fb = inject(FormBuilder);

  formUsuario = this.fb.group({
    nombre: ['', Validators.required],
    apPaterno: ['', Validators.required],
    apMaterno: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    codUniversitario: [''],
    tipoCodUniversitario: ['']
  });

  constructor() { }

  guardar() {
    if (this.formUsuario.invalid) return;

    console.log('Datos enviados:', this.formUsuario.value);
  }

}
