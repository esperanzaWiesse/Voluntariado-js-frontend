export class ActividadModel {

    constructor(
        public nombre: string,
        public descripcion: string,
        public idActi?: string,
        public fecha?: Date,
        public duracionhoras?: number,
        public activo?: boolean,
    ){}
}