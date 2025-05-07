import { Request, Response } from "express";
import { Client, ClientAttributes } from "../models/client.model";
import jwt from 'jsonwebtoken';
import {Op} from "sequelize";
import { WhereOptions } from 'sequelize';

const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

const clientController = {

    createClient: async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId, phone, address, codePostal } = req.body;

            const client = await Client.create({
                userId,
                address,
                codePostal,
                phone
            });

            res.status(201).json(client);
        } catch (error) {
            if(error instanceof Error){
                console.error("Erreur lors de la création du client:", error.message);
                res.status(500).json({ message: "Erreur lors de la création du client:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la création du client.");
                res.status(500).json({ message: "Erreur inconnue lors de la création du client" });
            }
        }
    },

    getAll: async (req: Request, res: Response): Promise<any> => {
        try {
            //On ajoute un contrôle sur le rôle de l'utilisateur
            const allowedRoles = ['admin', 'commercial'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            if (!allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            //On récupère tous les clients
            const clients = await Client.findAll({});

            //On renvoie les clients
            res.status(200).json(clients);
        } catch (error: unknown) {
            if(error instanceof Error){
                console.error("Erreur lors de la récupération des clients:", error.message);
                res.status(500).json({ message: "Erreur lors de la récupération des clients:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la récupération des clients.");
                res.status(500).json({ message: "Erreur inconnue lors de la récupération des clients" });
            }
        }
    },

    getClient: async (req: Request, res: Response): Promise<any> => {
        try {

            const allowedRoles = ['admin', 'commercial'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const { uuid } = req.params;

            if (!uuid) {
                return res.status(400).json({ message: 'UUID du client manquant' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            //On va vérifier si l'utilisateur connécté est admin ou si il s'agit de l'utilisateur qui fait la demande
            if (decoded.id !== uuid && !allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            //On récupère le livreur
            const client = await Client.findOne({
                where: { userId: uuid } as WhereOptions<ClientAttributes>
            });
            if (!client) {
                return res.status(404).json({ message: "Client non trouvé" });
            }
            res.status(200).json(client);

        } catch (error) {
            if(error instanceof Error){
                console.error("Erreur lors de la récupération du client:", error.message);
                res.status(500).json({ message: "Erreur lors de la récupération du client:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la récupération du client.");
                res.status(500).json({ message: "Erreur inconnue lors de la récupération du client" });
            }
        }
    },

    updateClient: async (req: Request, res: Response): Promise<any> => {
        try {

            const allowedRoles = ['admin', 'commercial'];
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

            //On récupère le client
            const client = await Client.findOne({
                where: { userId: uuid } as WhereOptions<ClientAttributes>
            });

            //On vérifie si le client existe
            if (!client) {
                return res.status(404).json({ message: "Client non trouvé" });
            }

            const { phone, address, codePostal } = req.body;
            //On contrôle que tous les champs soient bien présents
            if (!phone || !address || !codePostal) {
                return res.status(400).json({ message: "Tous les champs sont requis" });
            }

            //On met à jour le client
            await Client.update(
                { phone, address, codePostal },
                { where: { userId: uuid } }
            );
            //On récupère le client mis à jour
            const updatedClient = await Client.findOne({
                where: { userId: uuid } as WhereOptions<ClientAttributes>
            });
            //On renvoie le client mis à jour
            res.status(200).json(updatedClient);
        } catch(error: unknown) {
            if(error instanceof Error){
                console.error("Erreur lors de la mise à jour du client:", error.message);
                res.status(500).json({ message: "Erreur lors de la mise à jour du client:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la mise à jour du client.");
                res.status(500).json({ message: "Erreur inconnue lors de la mise à jour du client" });
            }
        }
    },

    deleteClient: async (req: Request, res: Response): Promise<any> => {
        try {

            const allowedRoles = ['admin', 'commercial'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const { uuid } = req.params;

            if (!uuid) {
                return res.status(400).json({ message: 'UUID du client manquant' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            //On va vérifier si l'utilisateur connécté est admin ou si il s'agit de l'utilisateur qui fait la demande
            if (!allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            //On supprime le client
            const client = await Client.destroy({
                where: { userId: uuid } as WhereOptions<ClientAttributes>
            });

            //On retourne un message de succès
            res.status(200).json({ message: "Client supprimé: ", client});

        } catch (error) {
            if(error instanceof Error){
                console.error("Erreur lors de la récupération du client:", error.message);
                res.status(500).json({ message: "Erreur lors de la récupération du client:" + error.message });
            } else {
                console.error("Erreur inconnue lors de la récupération du client.");
                res.status(500).json({ message: "Erreur inconnue lors de la récupération du client" });
            }
        }
    },
}

export default clientController;