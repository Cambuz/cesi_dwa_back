import restaurantController from "../controller/restaurant.controller";
import {Application} from "express";

export default function registerRestaurantRoutes(app: Application) {
    // Route publique pour les types
    app.get("/restaurants/types", restaurantController.getAllTypes);

    // Routes protégées pour les restaurants
    app.get("/restaurants/", restaurantController.getAllRestaurants);
    app.post("/restaurants/", restaurantController.createRestaurant);
    app.get("/restaurants/id/:id", restaurantController.getRestaurant);
    app.get("/restaurants/owner/:ownerId", restaurantController.getRestaurant);
    app.put("/restaurants/:ownerId", restaurantController.updateRestaurant);
    app.delete("/restaurants/:ownerId", restaurantController.deleteRestaurant);
}