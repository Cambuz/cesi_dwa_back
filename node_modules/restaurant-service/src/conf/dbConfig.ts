import { Sequelize } from 'sequelize-typescript';
import { Restaurant } from '../model/restaurant-model';
import { Type } from '../model/type-model';
import { RestaurantType } from '../model/restaurantType-model';

const dbOption = {
  db: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
};

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: dbOption.host,
  username: dbOption.user,
  password: dbOption.password,
  database: dbOption.db,
  models: [Restaurant, Type, RestaurantType],
  logging: false,  
});

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie.');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
  }
};