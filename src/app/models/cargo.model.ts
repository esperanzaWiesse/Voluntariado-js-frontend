import { publicDecrypt } from "crypto";

export class CargoModel {

    constructor(
        public nombreCargo: string,
        public descripcion: string,
        public idCargo?: string,
        public fechaCreacion?: Date,
        public activo?: boolean,
    ){}
}