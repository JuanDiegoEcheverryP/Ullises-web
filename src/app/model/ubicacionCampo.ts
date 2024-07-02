import { jornada } from "./jornada";

export class UbicacionCampo {

    constructor(
        public distancia: number,
        public ubicacion: string,
        public sede: string,
        public fecha: number,
    ) { }
}