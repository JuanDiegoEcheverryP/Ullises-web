import { Mantenimiento } from "./mantenimiento";
import { PrestamoArco } from "./prestamoArco";

export class Arco {

    constructor(
        public id: number,
        public calidad?: string,
        public estado?: string,
        public libraje?: number,
        public tipo?: string,
        public mano?: string,
        public estadoCuerda?: string,
        public estadoRest?: string,
        public estadoPalas?: string,
        public estadoPintura?: string,
        public mantenimiento?: Mantenimiento[],
        public historial?: PrestamoArco[],
    ) { }
}