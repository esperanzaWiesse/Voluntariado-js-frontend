// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UsuarioService } from '../service.index';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const usuarioService = inject(UsuarioService);
  
  // Obtener el token del servicio
  const token = usuarioService.token;
  
  // Si existe el token, clonar la petición y agregar el header
  if (token && token.length > 5) {
    const clonedRequest = req.clone({
      setHeaders: {
        'x-token': token
      }
    });
    return next(clonedRequest);
  }
  
  // Si no hay token, continuar con la petición original
  return next(req);
};