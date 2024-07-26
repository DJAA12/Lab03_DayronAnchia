import {Router} from "express"
import facturas from "./facturas";

const routes= Router();

routes.use("/facturas", facturas );

export default routes;

