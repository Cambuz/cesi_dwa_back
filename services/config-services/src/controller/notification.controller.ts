import { Request, Response } from "express";
import {unlink} from "fs";
import Notification, { INotification } from "../models/notification.model.ts";
import { NotificationType } from "../models/notificationType.enum.ts";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

const notificationController = {
    getNotifications: async (req: Request, res: Response): Promise<any> => {
        try {
            //On contrôle que le paramètre uuid est bien présent dans l'url
            const { uuid } = req.params;
            if (!uuid) {
                return res.status(400).send({
                    message: "Le paramètre uuid est requis"
                });
            }

            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            //On va vérifier si l'utilisateur connécté est admin ou si il s'agit de l'utilisateur qui fait la demande
            if (decoded.id !== uuid) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            //On va récupérer les notifications de l'utilisateur
            const notifications = await Notification.find({ userId: uuid });
            if (notifications.length === 0) {
                return res.status(200).send({
                    message: "Aucune notification trouvée pour cet utilisateur",
                    data: []
                });
            }

            //On supprime les notifications en base après récupération
            await Notification.deleteMany({ userId: uuid });

            //On renvoie les notifications à l'utilisateur avec leurs IDs
            console.log("✅ Notifications récupérées avec succès :", notifications);
            res.status(200).send({
                message: "Notifications récupérées avec succès",
                data: notifications.map((notification: INotification) => ({
                    id: notification.id,
                    userId: notification.userId,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message
                }))
            });

        } catch (error: unknown) {
            // Vérifie si 'error' est une instance d'Error
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des notifications :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des notifications",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des notifications"
                });
            }
        }
    },

    postNotification: async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId, type, title, message } = req.body;
            const id = uuidv4();

            //On vérifie que les champs sont bien définies
            if (!userId || !type || !title || !message) {
                return res.status(400).send({
                    message: "Tous les champs sont requis : userId, type, title et message"
                });
            }
            //On contrôle que l'ENUM de type est bien respecté
            if (!Object.values(NotificationType).includes(type)) {
                return res.status(400).send({
                    message: "Le type de notification est invalide"
                });
            }

            //On va créer une nouvelle notification
            const newNotification = new Notification({
                id,
                userId,
                type,
                title,
                message
            });

            await newNotification.save();
            res.status(201).json(newNotification);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la création de la notification:", error.message);
                res.status(500).json({ error: "Erreur serveur : " + error.message });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des notifications"
                });
            }
        }
    },

    getNotification: async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId } = req.params;
            const notifications = await Notification.find({ userId });
            res.status(200).json(notifications);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la récupération des notifications:", error.message);
                res.status(500).json({ error: "Erreur serveur : " + error.message });
            } else {
                res.status(500).json({ error: "Erreur serveur inconnue." });
            }
        }
    },
}

export default notificationController;
