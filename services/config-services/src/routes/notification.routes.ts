import notificationController from "../controller/notification.controller.ts";
import {Application} from "express";

export default function registerNotificationRoutes(app: Application) {
    app.get("/config/getNotification/:uuid", notificationController.getNotifications);
    app.post("/config/postNotification/", notificationController.postNotification);
}