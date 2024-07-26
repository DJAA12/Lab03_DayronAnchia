import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { Cabecera_Factura } from "./Cabecera_Factura";
import { Producto } from "./Producto";

@Entity()
export class Detalle_Factura {
    @PrimaryColumn()
    @IsNotEmpty({ message: 'El número de factura es obligatorio.' })
    @IsNumber({}, { message: 'El número de factura debe ser un número.' })
    numero_factura: number;

    @PrimaryColumn()
    @IsNotEmpty({ message: 'El código del producto es obligatorio.' })
    @IsNumber({}, { message: 'El código del producto debe ser un número.' })
    codigo_producto: number;

    @ManyToOne(() => Cabecera_Factura, cabecera_Factura => cabecera_Factura.Detalle_Factura)
    @JoinColumn({ name: 'numero_factura' }) 
    @IsNotEmpty({ message: 'La cabecera de factura es obligatoria.' })
    Cabecera_Factura: Cabecera_Factura;

    @ManyToOne(() => Producto, producto => producto.Detalle_Factura)
    @JoinColumn({ name: 'codigo_producto' }) 
    @IsNotEmpty({ message: 'El producto es obligatorio.' })
    Producto: Producto;

    @Column('int')
    @IsPositive({ message: 'La cantidad debe ser un número positivo.' })
    @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
    cantidad: number;
}
