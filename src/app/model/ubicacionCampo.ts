import { jornada } from "./jornada";

export class UbicacionCampo {

    constructor(
        public distancia: number,
        public ubicacion: string,
        public sedeId: number,
        public fecha: string,
        public pacaId: number,
    ) { }
}