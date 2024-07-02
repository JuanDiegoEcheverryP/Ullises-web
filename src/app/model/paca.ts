import { Mantienimiento } from "./mantenimiento";
import { UbicacionCampo } from "./ubicacionCampo";

export class Paca {
    constructor(
        public id: number,
        public tipo: string,
        public ubicacion: string,
        public sede: string,
        public estado: string,
        public historialMantenimiento: Mantienimiento[],
        public historialCampo: UbicacionCampo[],
    ) {}
}