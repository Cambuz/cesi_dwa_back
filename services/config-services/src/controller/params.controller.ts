import Param from "../models/param.model.ts";
import { Request, Response } from "express";
import {unlink} from "fs";

const paramsController = {

    getParams: async (req: Request, res: Response) => {
        try {
            // Récupère tous les paramètres depuis la base de données
            const params = await Param.find();
            res.status(200).send({
                message: "Liste des paramètres récupérée avec succès",
                data: params
            });
        } catch (error: unknown) {
            // Vérifie si 'error' est une instance d'Error
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des paramètres :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des paramètres",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des paramètres"
                });
            }
        }
    },

    getParam: async (param: String) => {
        try {
            const foundParam = await Param.findOne({ param });
            if (foundParam) {
                return foundParam;
            } else {
                console.error(`❌ Paramètre '${param}' non trouvé`);
                return null;
            }
        } catch (error: unknown){
            if(error instanceof Error) {
                console.error("❌ Erreur lors de la récupération du paramètre :", error.message);
            } else {
                console.error("❌ Erreur inconnue");
            }
        }
    },

    // Méthode pour récupérer un paramètre spécifique par son nom
    callGetParam: async (req: Request, res: Response) => {
        const { param } = req.params; // Récupère le paramètre du nom du paramètre

        try {
            // Recherche le paramètre dans la base de données
            const foundParam = await Param.findOne({ param });

            if (foundParam) {
                res.status(200).send({
                    message: `Paramètre '${param}' trouvé`,
                    data: foundParam
                });
            } else {
                res.status(404).send({
                    message: `Paramètre '${param}' non trouvé`
                });
            }
        } catch (error: unknown) {
            // Vérifie si 'error' est une instance d'Error
            if (error instanceof Error) {
                console.error(`❌ Erreur lors de la récupération du paramètre '${param}':`, error.message);
                res.status(500).send({
                    message: `Erreur lors de la récupération du paramètre '${param}'`,
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: `Erreur inconnue lors de la récupération du paramètre '${param}'`
                });
            }
        }
    },

    // Fonction pour initialiser des paramètres par défaut
    initializeParams: async () => {
        try {
            // Paramètres à vérifier et initialiser
            const defaultParams = [
                { param: "deliveryPriceByKm", value: 0.40 },
                { param: "servicePrice", value: 2.00 },
                { param: "parrainagePrice", value: 5.00 }
            ];

            // Vérifie et initialise chaque paramètre
            for (const { param, value } of defaultParams) {
                const existingParam = await Param.findOne({ param });
                if (!existingParam) {
                    // Si le paramètre n'existe pas, on l'ajoute
                    await Param.create({ param, value });
                    console.log(`✅ Paramètre '${param}' initialisé à ${value}`);
                } else {
                    console.log(`⚙️ Paramètre '${param}' déjà existant`);
                }
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'initialisation des paramètres :", error);
        }
    }

};

export default paramsController;