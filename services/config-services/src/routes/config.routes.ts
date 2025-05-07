import configController from "../controller/config.controller.ts";
import {Application} from "express";

export default function registerConfigRoutes(app: Application) {
  app.post("/config/getDistance", configController.callGetDistance);
  app.post("/config/getCommandPrice", configController.getCommandPrice);
}
