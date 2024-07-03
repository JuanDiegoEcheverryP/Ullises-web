import { Empleado } from "./empleado";
import { UbicacionCampo } from "./ubicacionCampo";

export class jornada {

    constructor(
        public id: number,
        public horaInicio: number,
        public horaFinal: number,
        public fecha: string,
        public empleados: Empleado[],
        public campo: UbicacionCampo[],
    ) { }
}