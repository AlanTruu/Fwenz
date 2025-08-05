import { Router } from "express";
import { getSessionsHandler, deleteSessionHandler, deleteAllSessionsHandler } from "../controllers/session.controller";
const sessionRoutes = Router();

sessionRoutes.get('/', getSessionsHandler)
sessionRoutes.delete('/:id', deleteSessionHandler)
sessionRoutes.delete('/', deleteAllSessionsHandler)

export default sessionRoutes