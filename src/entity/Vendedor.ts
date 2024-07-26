import { IsNotEmpty, MaxLength } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cabecera_Factura } from "./Cabecera_Factura";

@Entity()
export class Vendedor {
    @PrimaryGeneratedColumn()
    @IsNotEmpty({ message: 'El código del vendedor es obligatorio.' })
    codigo_vendedor: number;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'El nombre del vendedor es obligatorio.' })
    @MaxLength(100, { message: 'El nombre del vendedor debe tener un máximo de 100 caracteres.' })
    nombres_vendedor: string;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'El apellido del vendedor es obligatorio.' })
    @MaxLength(100, { message: 'El apellido del vendedor debe tener un máximo de 100 caracteres.' })
    apellidos_vendedor: string;

    @Column({ length: 200 })
    @IsNotEmpty({ message: 'La dirección del vendedor es obligatoria.' })
    @MaxLength(200, { message: 'La dirección del vendedor debe tener un máximo de 200 caracteres.' })
    direccion_vendedor: string;

    @Column({ length: 20 })
    @IsNotEmpty({ message: 'El teléfono del vendedor es obligatorio.' })
    @MaxLength(20, { message: 'El teléfono del vendedor debe tener un máximo de 20 caracteres.' })
    telefono_vendedor: string;

    @Column({ length: 20 })
    @IsNotEmpty({ message: 'El celular del vendedor es obligatorio.' })
    @MaxLength(20, { message: 'El celular del vendedor debe tener un máximo de 20 caracteres.' })
    celular_vendedor: string;

    @OneToMany(() => Cabecera_Factura, cabecera_Factura => cabecera_Factura.Vendedor)
    Cabecera_Factura: Cabecera_Factura[];
}
