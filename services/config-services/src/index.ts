import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { initializeMongoDB } from "./conf/mongoConfig";
import { initializeDatabase, sequelize } from './conf/dbConfig';
import swaggerOptions from './conf/swaggerConfig';
import { getHtmlPage } from './conf/htmlPageConfig';
import { initializeTypes } from "./conf/init";
import registerConfigRoutes from "./routes/config.routes.ts";
import registerParamsRoutes from "./routes/params.routes.ts";
import registerImageRoutes from "./routes/image.routes.ts";
import registerLogsRoutes from "./routes/logs.routes.ts";
import registerNotificationRoutes from "./routes/notification.routes.ts";
import dotenv from "dotenv";
import paramsController from "./controller/params.controller";  // Import du contrôleur
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.CONFIG_SERVICE_PORT || 3007;

// Configuration CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({limit: '10mb' }));

app.get("/", (req, res) => {
    res.send(getHtmlPage());
});

app.use("/public/images", express.static(path.join(__dirname, "public", "images")));

//Définition des routes
registerConfigRoutes(app);
registerParamsRoutes(app);
registerImageRoutes(app);
registerLogsRoutes(app);
registerNotificationRoutes(app);
app.use((req, res, next) => {
    console.log("📢 Requête reçue :", req.method, req.originalUrl);
    next();
});

app.use(cors({
    origin: 'http://localhost',  // Ajuste l'URL pour correspondre à ton client Swagger
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
    try {
        await initializeDatabase();
        await sequelize.sync({ force: false });
        console.log("✅ Tables synchronisées");

        await initializeMongoDB(); // Connexion MongoDB ici

        // Initialisation des paramètres par défaut
        await paramsController.initializeParams();

        await initializeTypes();

        app.listen(port, () => {
            console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ Erreur au démarrage du serveur :", error);
    }
};
startServer().then(r => {});