import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';


import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Dashboard} from './dashboard/dashboard';
import { Pages } from './pages';

// paginacion
// import {NgxPaginationModule} from 'ngx-pagination';

import {Usuarios} from './usuario/usuarios';




@NgModule({
    declarations: [
        Pages,
        Dashboard,
        Usuarios,
    ],
    exports: [
        Dashboard,
    ],
    imports: [
        // SharedModule,
        PAGES_ROUTES,
        FormsModule,
        CommonModule,
        // NgxPaginationModule
    ]
})

export class PagesModule { }