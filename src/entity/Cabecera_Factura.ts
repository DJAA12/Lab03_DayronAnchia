import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Vendedor } from "./Vendedor";
import { Detalle_Factura } from "./Detalle_Factura";
import { IsNotEmpty, IsDate } from "class-validator";

@Entity()
export class Cabecera_Factura {
    @PrimaryGeneratedColumn()
    @IsNotEmpty({ message: 'El número de factura es obligatorio.' })
    numero: number;

    @Column({ type: 'date' })
    @IsDate({ message: 'La fecha debe ser una fecha válida.' })
    fecha: Date;

    @Column({ default: false })
    eliminada: boolean;

    @ManyToOne(() => Cliente, cliente => cliente.Cabecera_Factura)
    @JoinColumn({ name: 'ruc_cliente' })
    @IsNotEmpty({ message: 'El cliente es obligatorio.' })
    Cliente: Cliente;

    @ManyToOne(() => Vendedor, vendedor => vendedor.Cabecera_Factura)
    @JoinColumn({ name: 'codigo_vendedor' }) 
    @IsNotEmpty({ message: 'El vendedor es obligatorio.' })
    Vendedor: Vendedor;

    @OneToMany(() => Detalle_Factura, detalle_Factura => detalle_Factura.Cabecera_Factura, { cascade: true })
    Detalle_Factura: Detalle_Factura[];
}
