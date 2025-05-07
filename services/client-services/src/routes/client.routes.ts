import clientController from "../controller/client.controller.ts";
import { Application } from "express";

export default function registerClientRoutes(app: Application) {
    app.post("/client/", clientController.createClient);
    app.get("/client/", clientController.getAll);
    app.get("/client/:uuid", clientController.getClient);
    app.put("/client/:uuid", clientController.updateClient);
    app.delete("/client/:uuid", clientController.deleteClient);

}