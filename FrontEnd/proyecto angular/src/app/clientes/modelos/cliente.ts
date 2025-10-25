import { Categoria } from "../../categorias/modelos/categoria";

export class Cliente
 {    
    id!: number;
    nombre!: string;
    apellido!: string;
    createAt!: string;
    email!: string;
    objCategoria: Categoria | null = null;
}

