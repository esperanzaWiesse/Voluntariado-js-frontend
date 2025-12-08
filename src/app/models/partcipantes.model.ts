export interface Participacion {
    idActividad: number;
    idUsuario: number;
    horasRealizadas?: number;
    completado?: boolean;
    nombreUsuario?: string;
    apPaterno?: string;
    apMaterno?: string;
    // Optional fields for display purposes
    Usuario?: {
        nombre: string;
        apPaterno: string;
        apMaterno: string;
        email: string;
    };
    Actividad?: {
        nombre: string;
    };
}

export interface ActividadReporte {
    nombre: string;
    horas: number;
    fecha: string;
}

export interface DetalleGrupo {
    idGrupoVoluntariado: number;
    nombreGrupo: string;
    totalHorasGrupo: number;
    actividades: ActividadReporte[];
}

export interface ReporteParticipacion {
    ok: boolean;
    idUsuario: number;
    totalHorasAcumuladas: number;
    beneficioCorrespondiente: string;
    detallePorGrupo: DetalleGrupo[];
}
