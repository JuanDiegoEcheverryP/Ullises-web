import { RegistroEmpleado } from "./registroEmpleado";

export class Empleado {

    constructor(
        public cedula: number,
        public correo: string,
        public estado: boolean,
        public registro: RegistroEmpleado[],
    ) { }
}