import imageController from "../controller/image.controller.ts";
import {Application} from "express";
export default function registerImageRoutes(app: Application) {
    app.post("/config/postImage/", imageController.postImage);
    app.post("/config/getImage/", imageController.getImage);
}