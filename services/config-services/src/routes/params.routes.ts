import paramsController from "../controller/params.controller.ts";
import {Application} from "express";

export default function registerParamsRoutes(app: Application) {
    app.get("/config/getParams", paramsController.getParams);
    app.get("/config/getParam/:param", paramsController.callGetParam);
}