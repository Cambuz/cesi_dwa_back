import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { initializeDatabase, sequelize } from './conf/dbConfig';
import swaggerOptions from './conf/swaggerConfig';
import { getHtmlPage } from './conf/htmlPageConfig';
import registerCommandeRoutes from "./routes/commande.routes";

const app = express();
const PORT = process.env.COMMANDE_SERVICE_PORT || 3005;

// Configuration CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send(getHtmlPage());
});

app.use((req, res, next) => {
    console.log("📢 Requête reçue :", req.method, req.originalUrl);
    next();
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

registerCommandeRoutes(app);

const startServer = async () => {
    try {
        await initializeDatabase();
        await sequelize.sync({ force: false });
        console.log("✅ Tables synchronisées");

        app.listen(PORT, () => {
            console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Impossible de se connecter à la base de données:", error);
    }
};

startServer();