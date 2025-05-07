import { Request, Response } from "express";
import { Livreur, LivreurAttributes } from "../models/livreur.model";
import jwt from 'jsonwebtoken';
import {Op} from "sequelize";
import { WhereOptions } from 'sequelize';


const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

const livreurController = {

    createLivreur: async (req: Request, res: Response) => {
        try {
            const { userId, phone, vehicule } = req.body;

            const livreur = await Livreur.create({
                userId,
                phone,
                vehicule,
            });

            res.status(201).json(livreur);
        } catch (error) {
            if(error instanceof Error){
                console.error("Erreur lors de la création du livreur:", error.message);
                res.status(500).json({ message: "Erreur lors de la création du livreur:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la création du livreur.");
                res.status(500).json({ message: "Erreur inconnue lors de la création du livreur" });
            }
        }
    },

    getAll: async (req: Request, res: Response):  Promise<any> => {
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

            //On récupère TOUS les livreurs (un livreur sans id n'existe pas)
            const livreurs = await Livreur.findAll({});

            res.status(200).json(livreurs);
        } catch (error) {
            if(error instanceof Error){
                console.error("Erreur lors de la récupération des livreurs:", error.message);
                res.status(500).json({ message: "Erreur lors de la récupération des livreurs:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la récupération des livreurs.");
                res.status(500).json({ message: "Erreur inconnue lors de la récupération des livreurs" });
            }
        }
    },

    getLivreurByUserId: async (req: Request, res: Response): Promise<any> => {
        try {

            const allowedRoles = ['admin'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const { uuid } = req.params;

            if (!uuid) {
                return res.status(400).json({ message: 'UUID du livreur manquant' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            //On va vérifier si l'utilisateur connécté est admin ou si il s'agit de l'utilisateur qui fait la demande
            if (decoded.id !== uuid && !allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            //On récupère le livreur
            const livreur = await Livreur.findOne({
                where: { userId: uuid } as WhereOptions<LivreurAttributes>
            });
            if (!livreur) {
                return res.status(404).json({ message: "Livreur non trouvé" });
            }
            res.status(200).json(livreur);

        } catch (error) {
            if(error instanceof Error){
                console.error("Erreur lors de la récupération du livreur:", error.message);
                res.status(500).json({ message: "Erreur lors de la récupération du livreur:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la récupération du livreur.");
                res.status(500).json({ message: "Erreur inconnue lors de la récupération du livreur" });
            }
        }
    },

    deleteLivreurByUserId: async (req: Request, res: Response): Promise<any> => {
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

            const { uuid } = req.params;
            if (!uuid) {
                return res.status(400).json({ message: 'UUID du livreur manquant' });
            }

            //On supprime le livreur
            const livreur = await Livreur.destroy({
                where: { userId: uuid } as WhereOptions<LivreurAttributes>
            });
            //On renvoie un message de succès
            if (!livreur) {
                return res.status(404).json({ message: "Livreur non trouvé" });
            }
            res.status(200).json({ message: "Livreur supprimé avec succès" });


        } catch (error) {
            if(error instanceof Error){
                console.error("Erreur lors de la suppression du livreur:", error.message);
                res.status(500).json({ message: "Erreur lors de la suppression du livreur:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la suppression du livreur.");
                res.status(500).json({ message: "Erreur inconnue lors de la suppression du livreur" });
            }
        }
    },

    updateLivreurByUserId: async (req: Request, res: Response): Promise<any> => {
        try {

            const allowedRoles = ['admin'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const { uuid } = req.params;

            if (!uuid) {
                return res.status(400).json({ message: 'UUID du livreur manquant' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            //On va vérifier si l'utilisateur connécté est admin ou si il s'agit de l'utilisateur qui fait la demande
            if (decoded.id !== uuid && !allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            const livreur = await Livreur.findOne({
                where: { userId: uuid } as WhereOptions<LivreurAttributes>
            });

            if (!livreur) {
                return res.status(404).json({ message: "Livreur non trouvé" });
            }

            //On met à jour le livreur
            const { phone, vehicule, gpsLongitude, gpsLatitude } = req.body;
            livreur.phone = phone;
            livreur.vehicule = vehicule;

            await livreur.save();

            res.status(200).json(livreur);

        } catch (error) {
            if(error instanceof Error){
                console.error("Erreur lors de la mise à jour du livreur:", error.message);
                res.status(500).json({ message: "Erreur lors de la mise à jour du livreur:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la mise à jour du livreur.");
                res.status(500).json({ message: "Erreur inconnue lors de la mise à jour du livreur" });
            }
        }
    }
}

export default livreurController;