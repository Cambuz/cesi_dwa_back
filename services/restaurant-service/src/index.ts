import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { initializeDatabase, sequelize } from './conf/dbConfig'; 
import swaggerOptions from './conf/swaggerConfig'; 
import { getHtmlPage } from './conf/htmlPageConfig'; 
import { initializeTypes } from "./conf/init";
import registerRestaurantRoutes from "./routes/restaurant.routes";

const app = express();
const port = process.env.RESTAURANT_SERVICE_PORT || 3001;

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



registerRestaurantRoutes(app);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
  try {
    await initializeDatabase();
    await sequelize.sync({ force: false });
    console.log("✅ Tables synchronisées");

    await initializeTypes();
    
    app.listen(port, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error);
  }
};

startServer();