import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cabecera_Factura } from "../entity/Cabecera_Factura";
import { Cliente } from "../entity/Cliente";
import { Vendedor } from "../entity/Vendedor";
import { Producto } from "../entity/Producto";
import { Detalle_Factura } from "../entity/Detalle_Factura";

class FacturasController {
    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const repo = AppDataSource.getRepository(Cabecera_Factura);
            const factura = await repo.findOne({
                where: { numero: parseInt(id), eliminada: false },
                relations: ["Cliente", "Vendedor", "Detalle_Factura", "Detalle_Factura.Producto"]
            });

            if (!factura) {
                return res.status(404).json({ message: "Factura no encontrada." });
            }

            delete factura.eliminada;
            factura.Detalle_Factura.forEach(detalle => {
                delete detalle.Producto.stock_maximo_producto;
                delete detalle.Producto.stock_minimo_producto;
            });

            return res.status(200).json(factura);
        } catch (error) {
            return res.status(400).json({ message: "Error al acceder a la base de datos." });
        }
    }

    static create = async (req: Request, res: Response) => {
        const { fecha, clienteId, vendedorId, detalles } = req.body;
    
        try {
            const repoCabecera = AppDataSource.getRepository(Cabecera_Factura);
            const repoCliente = AppDataSource.getRepository(Cliente);
            const repoVendedor = AppDataSource.getRepository(Vendedor);
            const repoProducto = AppDataSource.getRepository(Producto);
            const repoDetalle = AppDataSource.getRepository(Detalle_Factura);
            const cliente = await repoCliente.findOneBy({ ruc_cliente: clienteId });
            if (!cliente) {
                return res.status(404).json({ message: "Cliente no encontrado." });
            }
    
            const vendedor = await repoVendedor.findOneBy({ codigo_vendedor: vendedorId });
            if (!vendedor) {
                return res.status(404).json({ message: "Vendedor no encontrado." });
            }

            const detallesFactura = [];
            for (const det of detalles) {
                const producto = await repoProducto.findOneBy({ codigo_producto: det.productoId });
                if (!producto) {
                    return res.status(404).json({ message: `Producto con id ${det.productoId} no encontrado.` });
                }
    
                if (producto.stock_maximo_producto < det.cantidad) {
                    return res.status(400).json({ message: `Stock insuficiente para el producto con id ${det.productoId}.` });
                }
    
                producto.stock_maximo_producto -= det.cantidad;
    
                if (producto.stock_maximo_producto < producto.stock_minimo_producto) {
                    console.warn(`El stock del producto con id ${det.productoId} ha caído por debajo del mínimo.`);
                }
    
                detallesFactura.push({
                    producto,
                    cantidad: det.cantidad
                });
            }

            const nuevaFactura = new Cabecera_Factura();
            nuevaFactura.fecha = fecha;
            nuevaFactura.Cliente = cliente;
            nuevaFactura.Vendedor = vendedor;
            nuevaFactura.Detalle_Factura = [];
            nuevaFactura.eliminada = false;
    
            const savedFactura = await repoCabecera.save(nuevaFactura);
    
            const detallesFacturaEntities = detallesFactura.map(det => {
                const nuevoDetalle = new Detalle_Factura();
                nuevoDetalle.numero_factura = savedFactura.numero;
                nuevoDetalle.codigo_producto = det.producto.codigo_producto;
                nuevoDetalle.cantidad = det.cantidad;
                nuevoDetalle.Producto = det.producto;
                nuevoDetalle.Cabecera_Factura = savedFactura;
                return nuevoDetalle;
            });
    
            await repoDetalle.save(detallesFacturaEntities);
            await repoProducto.save(detallesFactura.map(det => det.producto));
    
            return res.status(201).json({
                message: "Factura creada correctamente."
            });
        } catch (error) {
            console.error('Error al crear la factura:', error);
            const errorMessage = error.message || 'Error desconocido';
            return res.status(400).json({ message: "Error al crear la factura.", error: errorMessage });
        }
    }    

    static delete = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const repo = AppDataSource.getRepository(Cabecera_Factura);
            const factura = await repo.findOneBy({ numero: parseInt(id) });

            if (!factura) {
                return res.status(404).json({ message: "Factura no encontrada." });
            }

            factura.eliminada = true;
            await repo.save(factura);

            return res.status(200).json({ message: "Factura eliminada correctamente." });
        } catch (error) {
            return res.status(400).json({ message: "Error al eliminar la factura." });
        }
    }

    static getAll = async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getRepository(Cabecera_Factura);
            const facturas = await repo.find({
                where: { eliminada: false },
                relations: ["Cliente", "Vendedor", "Detalle_Factura", "Detalle_Factura.Producto"]
            });

            facturas.forEach(factura => {
                delete factura.eliminada;
                factura.Detalle_Factura.forEach(detalle => {
                    delete detalle.Producto.stock_maximo_producto;
                    delete detalle.Producto.stock_minimo_producto;
                });
            });
            return res.status(200).json(facturas);
        } catch (error) {
            return res.status(400).json({ message: "Error al acceder a la base de datos." });
        }
    }

    static update = async (req: Request, res: Response) => {
        const { fecha, detalles } = req.body;
        const { id } = req.params;  
    
        const cabeceraRepository = AppDataSource.getRepository(Cabecera_Factura);
        const detalleRepository = AppDataSource.getRepository(Detalle_Factura);
        const productoRepository = AppDataSource.getRepository(Producto);
    
        try {
            const cabeceraExistente = await cabeceraRepository.findOne({
                where: { numero: parseInt(id) },  
                relations: ['Detalle_Factura']
            });
    
            if (!cabeceraExistente) {
                return res.status(404).json({ message: 'Factura no encontrada' });
            }
    
            if (fecha) {
                cabeceraExistente.fecha = fecha;
            }
            const detallesExistentesMap = new Map(
                cabeceraExistente.Detalle_Factura.map(det => [det.codigo_producto, det])
            );
            for (const detalle of detalles) {
                const producto = await productoRepository.findOne({ where: { codigo_producto: detalle.productoId } });
    
                if (!producto) {
                    return res.status(404).json({ message: `Producto con código ${detalle.productoId} no encontrado` });
                }
    
                const detalleExistente = detallesExistentesMap.get(detalle.productoId);
    
                if (detalleExistente) {
                    const diferencia = detalle.cantidad - detalleExistente.cantidad;
                    producto.stock_maximo_producto -= diferencia;
                    detalleExistente.cantidad = detalle.cantidad;
                    await detalleRepository.save(detalleExistente);
                } else {
                    const nuevoDetalle = detalleRepository.create({
                        numero_factura: cabeceraExistente.numero, 
                        codigo_producto: detalle.productoId,
                        cantidad: detalle.cantidad,
                        Producto: producto,
                        Cabecera_Factura: cabeceraExistente,
                    });
    
                    producto.stock_maximo_producto -= detalle.cantidad;
                    await detalleRepository.save(nuevoDetalle);
                }
    
                if (producto.stock_maximo_producto < producto.stock_minimo_producto) {
                    console.warn(`Alerta: El stock del producto ${producto.codigo_producto} es menor al stock mínimo.`);
                }
    
                await productoRepository.save(producto);
            }

            const detallesSolicitadosIds = detalles.map(d => d.productoId);
            for (const detalleExistente of cabeceraExistente.Detalle_Factura) {
                if (!detallesSolicitadosIds.includes(detalleExistente.codigo_producto)) {
                    await detalleRepository.remove(detalleExistente);
                }
            }

            await cabeceraRepository.save(cabeceraExistente);
    
            return res.status(200).json({ message: 'Factura actualizada correctamente' });
        } catch (error) {
            console.error('Error al actualizar la factura:', error);
            return res.status(500).json({ message: 'Error al actualizar la factura', error: error.message });
        }
    };   
}

export default FacturasController;
