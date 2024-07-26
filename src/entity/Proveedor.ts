import { IsNotEmpty, MaxLength } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./Producto";

@Entity()
export class Proveedor {
    @PrimaryGeneratedColumn()
    @IsNotEmpty({ message: 'El código del proveedor es obligatorio.' })
    codigo_proveedor: number;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'El nombre del proveedor es obligatorio.' })
    @MaxLength(100, { message: 'El nombre del proveedor debe tener un máximo de 100 caracteres.' })
    nombres_proveedor: string;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'El apellido del proveedor es obligatorio.' })
    @MaxLength(100, { message: 'El apellido del proveedor debe tener un máximo de 100 caracteres.' })
    apellidos_proveedor: string;

    @Column({ length: 200 })
    @IsNotEmpty({ message: 'La dirección del proveedor es obligatoria.' })
    @MaxLength(200, { message: 'La dirección del proveedor debe tener un máximo de 200 caracteres.' })
    direccion_proveedor: string;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'La provincia del proveedor es obligatoria.' })
    @MaxLength(100, { message: 'La provincia del proveedor debe tener un máximo de 100 caracteres.' })
    provincia_proveedor: string;

    @Column({ length: 20 })
    @IsNotEmpty({ message: 'El teléfono del proveedor es obligatorio.' })
    @MaxLength(20, { message: 'El teléfono del proveedor debe tener un máximo de 20 caracteres.' })
    telefono_proveedor: string;

    @OneToMany(() => Producto, producto => producto.Proveedor)
    Producto: Producto[];
}