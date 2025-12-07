export class GrupoVoluntariadoModel {

    constructor(
        public nombreGrupoVoluntariado: string,
        public idGrupoVoluntariado?: string,
        public fechaCreacionGrupoVoluntariado?: Date,
        public duracionHoras?: number,
        public duracionDias?: number,
        public maxMiembros?: number,
        public descripcion?: string,
        public activo?: boolean,
    ){}
}