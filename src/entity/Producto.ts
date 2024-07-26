import { IsNotEmpty, IsNumber, IsPositive, MaxLength, IsDecimal } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Proveedor } from './Proveedor';
import { Detalle_Factura } from './Detalle_Factura';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    @IsNotEmpty({ message: 'El código del producto es obligatorio.' })
    @IsNumber({}, { message: 'El código del producto debe ser un número.' })
    codigo_producto: number;

    @Column({ length: 200 })
    @IsNotEmpty({ message: 'La descripción del producto es obligatoria.' })
    @MaxLength(200, { message: 'La descripción del producto debe tener un máximo de 200 caracteres.' })
    descripcion_producto: string;

    @Column('decimal', { precision: 10, scale: 2 })
    @IsDecimal({}, { message: 'El precio del producto debe ser un número decimal válido.' })
    @IsNotEmpty({ message: 'El precio del producto es obligatorio.' })
    precio_producto: number;

    @Column('int')
    @IsPositive({ message: 'El stock máximo del producto debe ser un número positivo.' })
    @IsNotEmpty({ message: 'El stock máximo del producto es obligatorio.' })
    stock_maximo_producto: number;

    @Column('int')
    @IsPositive({ message: 'El stock mínimo del producto debe ser un número positivo.' })
    @IsNotEmpty({ message: 'El stock mínimo del producto es obligatorio.' })
    stock_minimo_producto: number;

    @ManyToOne(() => Proveedor, proveedor => proveedor.Producto)
    @JoinColumn({ name: 'codigo_proveedor' })
    @IsNotEmpty({ message: 'El proveedor es obligatorio.' })
    Proveedor: Proveedor;

    @OneToMany(() => Detalle_Factura, detalle_Factura => detalle_Factura.Producto)
    Detalle_Factura: Detalle_Factura[];
}