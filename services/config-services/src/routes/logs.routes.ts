import logsController from "../controller/logs.controller.ts";
import {Application} from "express";

export default function registerParamsRoutes(app: Application) {
    app.post("/config/postLogLogin", logsController.postLogLogin);
    app.get("/config/getLogsLogin", logsController.getLogsLogin);
    app.get("/config/getLogsLoginByUser/:uuid", logsController.getLogsLoginByUser);
    app.get("/config/getLastLogin/:uuid", logsController.getLastLogin);
    app.post("/config/postLogCommand", logsController.postLogCommand);
    app.get("/config/getLogsCommand", logsController.getLogsCommand);
    app.post("/config/postLogDownload", logsController.postLogDownload);
    app.get("/config/getLogsDownload", logsController.getLogsDownload);
}