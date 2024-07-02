import { jornada } from "./jornada";

export class Sede {

    constructor(
        public nombre: string,
        public direccion: string,
        public estado: string,
        public jornada: jornada[],
    ) { }
}