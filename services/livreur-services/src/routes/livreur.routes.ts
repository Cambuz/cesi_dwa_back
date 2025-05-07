import livreurController from "../controller/livreur.controller";
import { Application } from "express";

export default function registerLivreurRoutes(app: Application) {
    app.post("/livreur/", livreurController.createLivreur);
    app.get("/livreur/getAll", livreurController.getAll);
    app.get("/livreur/getLivreurByUserId/:uuid", livreurController.getLivreurByUserId);
    app.delete("/livreur/deleteLivreurByUserId/:uuid", livreurController.deleteLivreurByUserId);
    app.post("/livreur/updateLivreurByUserId/:uuid", livreurController.updateLivreurByUserId);
}