import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { Article } from "../model/article-model";
import { Menu } from "../model/menu-model";
import { MenuArticle } from "../model/menu-article";

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    models: [Article, Menu, MenuArticle],
    logging: false
});

export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie');
        
        await sequelize.sync({ alter: true });
        console.log('✅ Base de données synchronisée');
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error);
        throw error;
    }
}; 