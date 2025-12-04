import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { provideHttpClient } from '@angular/common/http';

import {
  UsuarioService,
  LogingGuardGuard
} from './service.index';

@NgModule({
  declarations: [],
  providers:[
    UsuarioService,
    LogingGuardGuard,
    provideHttpClient()
  ],
  imports: [
    CommonModule,
  ]
})
export class ServiceModule { }
