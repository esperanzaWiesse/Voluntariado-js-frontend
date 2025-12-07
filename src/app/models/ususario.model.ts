export class Usuario {

    constructor(
        public email: string,
        public password: string,
        // el ? significa que es obcional y que desde hay para abajo los demas tambien deven de ser obcionales
        public idUsuario?: string,
        public rol?: string,
        public nombre?: string,
        public apPaterno?: string,
        public apMaterno?: string,
        public dni?: string,
        public codUniversitario?: string,
        public tipoCodUniversitario?: string,
        public activo?: boolean,
        public fecha_creacion?: boolean,
        public fecha_actualizacion?: boolean,
        public fecha_eliminacion?: boolean,
    ) {}
}