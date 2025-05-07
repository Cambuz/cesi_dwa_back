import commandeController from "../controller/commande.controller";
import { Application } from "express";

export default function registerCommandeRoutes(app: Application) {
    app.post("/commande/createCommande", commandeController.createCommande);
    app.get("/commande/getCommands", commandeController.getCommands);
    app.put("/commande/:id", commandeController.updateCommande);
    app.get("/commande/stats/getTransactionnal", commandeController.getTransactional);
    app.get("/commande/stats/getGlobalCA", commandeController.getGlobalCA);
    app.get("/commande/stats/restaurant/:uuid", commandeController.getRestaurantStats);
    app.get("/commande/getCommand/:uuid", commandeController.getCommandById);
}