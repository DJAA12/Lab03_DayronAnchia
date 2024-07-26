import { IsNotEmpty, MaxLength } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Cabecera_Factura } from "./Cabecera_Factura";

@Entity()
export class Cliente {
    @PrimaryColumn({ length: 13 })
    @IsNotEmpty({ message: 'El RUC del cliente es obligatorio.' })
    @MaxLength(13, { message: 'El RUC del cliente debe tener un máximo de 13 caracteres.' })
    ruc_cliente: string;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'El nombre del cliente es obligatorio.' })
    @MaxLength(100, { message: 'El nombre del cliente debe tener un máximo de 100 caracteres.' })
    nombres_cliente: string;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'El apellido del cliente es obligatorio.' })
    @MaxLength(100, { message: 'El apellido del cliente debe tener un máximo de 100 caracteres.' })
    apellidos_cliente: string;

    @Column({ length: 200 })
    @IsNotEmpty({ message: 'La dirección del cliente es obligatoria.' })
    @MaxLength(200, { message: 'La dirección del cliente debe tener un máximo de 200 caracteres.' })
    direccion_cliente: string;

    @Column({ length: 20 })
    @IsNotEmpty({ message: 'El teléfono del cliente es obligatorio.' })
    @MaxLength(20, { message: 'El teléfono del cliente debe tener un máximo de 20 caracteres.' })
    telefono_cliente: string;

    @OneToMany(() => Cabecera_Factura, cabecera_Factura => cabecera_Factura.Cliente)
    Cabecera_Factura: Cabecera_Factura[];
}
