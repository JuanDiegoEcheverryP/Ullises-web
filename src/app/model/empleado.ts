import { RegistroEmpleado } from "./registroEmpleado";

export class Empleado {

    constructor(
        public id:number,
        public cedula: number,
        public correo: string,
        public estado: boolean,
        public registro: RegistroEmpleado[],
    ) { }
}