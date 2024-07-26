import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Cabecera_Factura } from "./entity/Cabecera_Factura"
import { Cliente } from "./entity/Cliente"
import { Detalle_Factura } from "./entity/Detalle_Factura"
import { Producto } from "./entity/Producto"
import { Proveedor } from "./entity/Proveedor"
import { Vendedor } from "./entity/Vendedor"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "lab03",
    synchronize: true,
    logging: false,
    entities: [User, Cabecera_Factura, Cliente, Detalle_Factura, Producto, Proveedor, Vendedor],
    migrations: [],
    subscribers: [],
})
