import { ServicioArquero } from "./servicioArquero";

export class Arquero {

    constructor(
        public id: number,
        public nombre: string,
        public correo: string,
        public servicioAdquirido: string,
        public libraje:number,
        public historialServicio: ServicioArquero[],
    ) { }
}