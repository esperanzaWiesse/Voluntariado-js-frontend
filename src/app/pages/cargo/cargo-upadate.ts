import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { CargoService } from '../../service/service.index';
import { CargoModel } from '../../models/cargo.model';

@Component({
  selector: 'app-cargo-upadate',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './cargo-upadate.html',
  styleUrl: './cargo-upadate.css',
})
export class CargoUpadate implements OnInit {

  private fb = inject(FormBuilder);
  cargoSeleccionado: CargoModel | null = null;

  formCargo = this.fb.group({
    nombreCargo: ['', Validators.required],
    descripcion: ['', Validators.required],
    fechaCreacion: ['', Validators.required]
  });

  ngOnInit() {
  const hoy = new Date().toISOString().substring(0, 10);
  this.formCargo.get('fechaCreacion')?.setValue(hoy);
  }

  constructor(
    public _cargoService: CargoService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarCargo(id);
      }

    });
  }

  cargarCargo(id: string) {
    this._cargoService.cargarCargo(id).subscribe(cargo => {
      this.cargoSeleccionado = cargo;

       // Convertir la fecha ISO a formato yyyy-MM-dd para el input type="date"
      if (cargo.fechaCreacion) {
        const fechaFormateada = new Date(cargo.fechaCreacion).toISOString().substring(0, 10);
        cargo.fechaCreacion = fechaFormateada;
      }

       this.formCargo.patchValue(cargo);
    });
  }

  guardarCargo() {
     if (this.formCargo.invalid) {
      this.formCargo.markAllAsTouched();
      return;
    }

    const formValue: any = this.formCargo.value;

    // En edición, agregar ID y manejar pass vacío
    if (this.cargoSeleccionado) {
      formValue.idCargo = this.cargoSeleccionado.idCargo;
    }

    // Enviar al servicio
        this._cargoService.guardarCargo(formValue)
          .subscribe({
            next: (resp) => {
              this.router.navigate(['/pages/cargos']);
            },
            error: (err) => {
              console.log(`error rrrr: ${err.error.errores[0]}`);
              Swal.fire('Error', `${err.error.errores[0]}`, 'error');
            }
          });
  }

}