import express from "express";
import cors from "cors";
import users from "./views/user";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { initializeDatabase, sequelize } from './conf/dbConfig'; 
import { createAdminIfNotExists } from './conf/initialize'; 
import swaggerOptions from './conf/swaggerConfig'; 
import { getHtmlPage } from './conf/htmlPageConfig'; 

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 3000;

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

app.use((req, res, next) => {
    console.log("📢 Requête reçue :", req.method, req.originalUrl);
    next();
});

app.use("/users", users);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
  try {
    await initializeDatabase(); 
    await sequelize.sync({ force: false }); 
    console.log("✅ Tables synchronisées");
    await createAdminIfNotExists();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error);
  }
};

startServer();