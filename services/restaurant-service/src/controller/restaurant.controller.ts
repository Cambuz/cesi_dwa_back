import { Request, Response } from "express";
import { Restaurant, RestaurantAttributes } from "../model/restaurant-model";
import { Type } from "../model/type-model";
import {UUID, WhereOptions} from 'sequelize';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

const restaurantController = {

    createRestaurant: async (req: Request, res: Response): Promise<void> => {
        try {
            const { ownerId, logo, restaurantName, address, siret, codePostal, types } = req.body;

            if (!restaurantName || !address || !siret || !codePostal) {
                res.status(400).json({ error: "Les champs name, address, siret et codePostal sont requis." });
                return;
            }

            const newRestaurant = await Restaurant.create({
                ownerId,
                logo: logo || null,
                restaurantName,
                address,
                siret,
                codePostal,
            });

            // Si des types sont spécifiés, on les associe au restaurant
            if (types && Array.isArray(types)) {
                try {
                    const typeInstances = await Type.findAll({
                        where: { id: types }
                    });
                    await newRestaurant.$set('types', typeInstances);
                } catch (error) {
                    console.error("Erreur lors de l'association des types:", error);
                    // On continue même si l'association des types échoue
                }
            }

            // On récupère le restaurant avec ses types associés
            const restaurantWithTypes = await Restaurant.findOne({
                where: { id: newRestaurant.id },
                include: [{
                    model: Type,
                    through: { attributes: [] }
                }]
            });
            
            res.status(201).json(restaurantWithTypes);
        } catch (error: unknown) {
            console.error("Erreur détaillée lors de la création du restaurant:", error);
            if (error instanceof Error) {
                console.error("Message d'erreur:", error.message);
                console.error("Stack trace:", error.stack);
                res.status(500).json({ 
                    error: "Erreur serveur : " + error.message,
                    details: error.stack
                });
            } else {
                res.status(500).json({ error: "Erreur serveur inconnue." });
            }
        }
    },

    getRestaurant: async (req: Request, res: Response): Promise<any> => {
        try {
            const { id, ownerId } = req.params;

            let whereCondition = {};
            if (id) {
                whereCondition = { id };
            } else if (ownerId) {
                whereCondition = { ownerId };
            } else {
                return res.status(400).json({ error: "ID ou ownerId requis." });
            }

            const restaurant = await Restaurant.findOne({
                where: whereCondition,
            });

            if (!restaurant) {
                res.status(404).json({ error: "Restaurant non trouvé." });
                return;
            }

            // On transforme les résultats pour garantir que le restaurant a une clé `types`, même vide
            const restaurantData = restaurant.toJSON();
            restaurantData.types = restaurantData.types || []; // Si pas de types, on envoie une liste vide

            res.status(200).json(restaurantData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erreur lors de la récupération du restaurant :", error.message);
                res.status(500).json({ error: "Erreur serveur : " + error.message });
            } else {
                res.status(500).json({ error: "Erreur serveur inconnue." });
            }
        }
    },

    getAllRestaurants: async (req: Request, res: Response): Promise<any> => {
        try {
            const restaurants = await Restaurant.findAll({
                include: [{
                    model: Type,
                    through: { attributes: [] }, // Ne pas inclure les colonnes de la table de liaison
                }],
            });

            // On transforme les résultats pour garantir que chaque restaurant a une clé `types`, même vide
            const result = restaurants.map(restaurant => {
                const restaurantData = restaurant.toJSON(); // Convertir en objet plain
                restaurantData.types = restaurantData.types || []; // Si pas de types, on envoie une liste vide
                return restaurantData;
            });

            res.status(200).json(result);

        } catch (error) {
            // Gestion des erreurs
            if (error instanceof Error) {
                console.error("Erreur lors de la récupération des restaurants :", error.message);
                return res.status(500).json({ error: "Erreur serveur : " + error.message });
            } else {
                return res.status(500).json({ error: "Erreur serveur inconnue." });
            }
        }
    },


    updateRestaurant: async (req: Request, res: Response): Promise<any> => {
        try {

            const allowedRoles = ['admin'];
            const token = req.headers.authorization?.split(' ')[1];

            console.log("token:", token);

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const { ownerId } = req.params;

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            console.log("secret key: ", SECRET_KEY);

            //On va vérifier si l'utilisateur connecté est admin ou si il s'agit de l'utilisateur qui fait la demande
            if (decoded.id !== ownerId  && !allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            const restaurant = await Restaurant.findOne(
                { where: { ownerId } }
            );

            if (!restaurant) {
                res.status(404).json({ error: "Restaurant non trouvé." });
                return;
            }

            const { restaurantName, address, siret, logo, codePostal, type } = req.body;
            restaurant.restaurantName = restaurantName;
            restaurant.address = address;
            restaurant.siret = siret;
            restaurant.logo = logo || null;
            restaurant.codePostal = codePostal;

            if (!restaurantName || !address || !siret || !logo || !codePostal) {
                res.status(400).json({ error: "Tous les champs sont requis." });
                return;
            }

            await restaurant.save();
            res.status(200).json(restaurant);

        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la mise à jour du restaurant :", error.message);
                res.status(500).json({ error: "Erreur serveur : " + error.message });
            } else {
                res.status(500).json({ error: "Erreur serveur inconnue." });
            }
        }
    },

    deleteRestaurant: async (req: Request, res: Response): Promise<any> => {
        try {

            //On ajoute un contrôle sur le rôle de l'utilisateur
            const allowedRoles = ['admin'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            if (!allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            const { id } = req.params;

            const restaurant = await Restaurant.destroy({ where: { id } });

            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant introuvable" });
            }

            res.status(200).json({ message: "Restaurant supprimé." });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erreur lors de la suppression du restaurant :", error.message);
                res.status(500).json({ error: "Erreur serveur : " + error.message });
            } else {
                res.status(500).json({ error: "Erreur serveur inconnue." });
            }
        }
    },

    getAllTypes: async (req: Request, res: Response): Promise<void> => {
        try {
            const types = await Type.findAll({
                attributes: ['id', 'name', 'icon']
            });

            if (types.length === 0) {
                res.status(404).json({ error: "Aucun type trouvé." });
                return;
            }

            res.status(200).json(types);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erreur lors de la récupération des types :", error.message);
                res.status(500).json({ error: "Erreur serveur : " + error.message });
            } else {
                res.status(500).json({ error: "Erreur serveur inconnue." });
            }
        }
    },

};

export default restaurantController;