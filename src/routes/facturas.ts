import { Router } from "express";
import FacturasController from "../controller/FacturasController";

const routes= Router();

routes.get("/getall", FacturasController.getAll)
routes.get("/:id", FacturasController.getById)
routes.post("", FacturasController.create)
routes.put("/:id", FacturasController.update)
routes.delete("/:id", FacturasController.delete)

export default routes;

