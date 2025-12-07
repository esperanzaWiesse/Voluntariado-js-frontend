export interface Inscripcion {
    idGrupoVoluntariado: number;
    idUsuario: number;
    idCargo: number;
    fechaInscripcion?: string;
    activo?: boolean;
    nombreUsuario?: string;
    apPaterno?: string;
    apMaterno?: string;
    email?: string;
    nombreCargo?: string;
}
