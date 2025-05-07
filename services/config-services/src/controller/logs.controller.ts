import { Request, Response } from "express";

import LogLogin from "../models/logLogin.model.ts";
import LogCommand from "../models/logCommand.model.ts";
import LogDownload from "../models/logDownload.model.ts";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

const logsController = {

    //Enregistrer une connexion en log
    postLogLogin: async (req: Request, res: Response) => {
        try {
            const { uuid, name, type } = req.body;
            const date : number = Date.now();
            const newLogLogin = new LogLogin({ uuid, date, name, type });
            await newLogLogin.save();
            res.status(200).send({
                message: "🚀 Log de connexion enregistré avec succès",
                data: newLogLogin,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de l'enregistrement du log de connexion :", error.message);
                res.status(500).send({
                    message: "Erreur lors de l'enregistrement du log de connexion",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de l'enregistrement du log de connexion",
                });
            }
        }
    },

    //Récuperer toutes les logs de connexion (contrôle de rôle)
    getLogsLogin: async (req: Request, res: Response): Promise<any> => {
        try {
            const allowedRoles = ['admin'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            if (!allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            const logs = await LogLogin.find();

            const formattedLogs = logs.map(log => {
                const date = new Date(log.date);

                const decomposedDate = {
                    day: date.getDate().toString().padStart(2, '0'),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // Mois commence à 0
                    year: date.getFullYear().toString(),
                    hour: date.getHours().toString().padStart(2, '0'),
                    minute: date.getMinutes().toString().padStart(2, '0'),
                    second: date.getSeconds().toString().padStart(2, '0'),
                };

                return {
                    uuid: log.uuid,
                    date: decomposedDate,
                    name: log.name,
                    type: log.type,
                };
            });

            res.status(200).send({
                message: "🚀 Logs de connexion récupérés avec succès",
                data: formattedLogs,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des logs de connexion :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des logs de connexion",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des logs de connexion",
                });
            }
        }
    },

    //Récuperer toutes les logs de connexion d'un utilisateur (contrôle de rôle)
    getLogsLoginByUser: async (req: Request, res: Response): Promise<any> => {
        try {
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
            const logs = await LogLogin.find({ uuid });

            if (logs.length === 0) {
                return res.status(404).json({ error: 'Aucun log trouvé pour cet utilisateur' });
            }

            const formattedLogs = logs.map(log => {
                const date = new Date(log.date);

                const decomposedDate = {
                    day: date.getDate().toString().padStart(2, '0'),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // Mois commence à 0
                    year: date.getFullYear().toString(),
                    hour: date.getHours().toString().padStart(2, '0'),
                    minute: date.getMinutes().toString().padStart(2, '0'),
                    second: date.getSeconds().toString().padStart(2, '0'),
                };

                return {
                    uuid: log.uuid,
                    date: decomposedDate,
                };
            });

            res.status(200).send({
                message: "🚀 Logs de connexion récupérés avec succès",
                data: formattedLogs,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des logs de connexion :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des logs de connexion",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des logs de connexion",
                });
            }
        }
    },

    //Récuperer la date de dernière connexion d'un utilisateur (contrôle de rôle/isUser)
    getLastLogin: async (req: Request, res: Response): Promise<any> => {
        try {
            //On commence par récuperer le token
            const allowedRoles = ['admin'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const { uuid } = req.params;

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            //On va vérifier si l'utilisateur connécté est admin ou si il s'agit de l'utilisateur qui fait la demande
            if (decoded.id !== uuid && !allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            //On va chercher les logs de connexion de l'utilisateur
            const logs = await LogLogin.find({ uuid });
            if (logs.length === 0) {
                return res.status(404).json({ error: 'Aucun log trouvé pour cet utilisateur' });
            }
            //On va chercher la log de connexion la plus récente
            const lastLog = logs.reduce((latest, log) => {
                return log.date > latest.date ? log : latest;
            });
            const date = new Date(lastLog.date);
            const decomposedDate = {
                day: date.getDate().toString().padStart(2, '0'),
                month: (date.getMonth() + 1).toString().padStart(2, '0'), // Mois commence à 0
                year: date.getFullYear().toString(),
                hour: date.getHours().toString().padStart(2, '0'),
                minute: date.getMinutes().toString().padStart(2, '0'),
                second: date.getSeconds().toString().padStart(2, '0'),
            };

            res.status(200).send({
                message: "🚀 Dernière connexion récupérée avec succès",
                data: {
                    uuid: lastLog.uuid,
                    date: decomposedDate,
                },
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des logs de connexion :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des logs de connexion",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des logs de connexion",
                });
            }
        }
    },

    //Enregistrer une commande en log
    postLogCommand: async (req: Request, res: Response) => {
        try {
            const { uuid, uuid_client, uuid_livreur, uuid_restaurant, final_status, prixCart, prixTTC, articles, menus } = req.body;
            const date : number = Date.now();
            const newLogCommand = new LogCommand({ uuid, uuid_client, uuid_livreur, uuid_restaurant, date, final_status, prixCart, prixTTC, articles, menus });
            await newLogCommand.save();
            res.status(200).send({
                message: "🚀 Log de commande enregistré avec succès",
                data: newLogCommand,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de l'enregistrement du log de commande :", error.message);
                res.status(500).send({
                    message: "Erreur lors de l'enregistrement du log de commande",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de l'enregistrement du log de commande",
                });
            }
        }
    },

    //Récuperer toutes les logs de commandes (contrôle de rôle)
    getLogsCommand: async (req: Request, res: Response): Promise<any> => {
        try {
           

            //On récupère toutes les logs
            const logs = await LogCommand.find();
            //On va formater les logs
            const formattedLogs = logs.map(log => {
                const date = new Date(log.date);

                const decomposedDate = {
                    day: date.getDate().toString().padStart(2, '0'),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // Mois commence à 0
                    year: date.getFullYear().toString(),
                    hour: date.getHours().toString().padStart(2, '0'),
                    minute: date.getMinutes().toString().padStart(2, '0'),
                    second: date.getSeconds().toString().padStart(2, '0'),
                };

                return {
                    uuid_client: log.uuid_client,
                    uuid_livreur: log.uuid_livreur,
                    uuid_restaurant: log.uuid_restaurant,
                    date: decomposedDate,
                    final_status: log.final_status,
                    prixCart: log.prixCart,
                    prixTTC: log.prixTTC,
                    articles: log.articles,
                    menus: log.menus,
                };
            });
            res.status(200).send({
                message: "🚀 Logs de commande récupérés avec succès",
                data: formattedLogs,
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des logs de connexion :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des logs de connexion",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des logs de connexion",
                });
            }
        }
    },

    postLogDownload: async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId, componentName } = req.body;
            //On génère la data
            const date : number = Date.now();
            const newLogDownload = new LogDownload({ userId, date, componentName });
            await newLogDownload.save();

            const allowedRoles = ['admin'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            //On va notifier tous les users ayant le type = "technique"
            //On va commencer par récuperer l'ensemble des utilisateurs via l'api
            let users: any[] = [];

            try {
                const response = await fetch("http://user-service:3000/users/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    console.error("❌ Erreur HTTP lors de la récupération des utilisateurs :", response.statusText);
                } else {
                    users = await response.json();
                }
            } catch (err) {
                console.error("❌ Erreur réseau lors de la récupération des utilisateurs :", err);
            }

            //On va filtrer les utilisateurs ayant le type = "technique"
            const techUsers = users.filter((user: any) => user.type === "technique");
            //On va notifier chaque utilisateur technique
            techUsers.forEach(async (user: any) => {
                //On va envoyer la notification
                await fetch("http://config-services:3007/config/postNotification", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        type: "success",
                        title: "Téléchargement d'un composant !",
                        message: `Le composant ${componentName} a été téléchargé`,
                    }),
                }).catch(err => {
                    console.error("❌ Erreur lors de l'envoi de la notification :", err);
                });
            });

            res.status(200).send({
                message: "🚀 Log de téléchargement enregistré avec succès",
                data: newLogDownload,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de l'enregistrement du log de téléchargement :", error.message);
                res.status(500).send({
                    message: "Erreur lors de l'enregistrement du log de téléchargement",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de l'enregistrement du log de téléchargement",
                });
            }
        }
    },

    getLogsDownload: async (req: Request, res: Response): Promise<any> => {
        try {
            const allowedRoles = ['admin', 'technique'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            if (!allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            //On récupère toutes les logs
            const logs = await LogDownload.find();
            //On va formater les logs
            const formattedLogs = logs.map(log => {
                const date = new Date(log.date);

                const decomposedDate = {
                    day: date.getDate().toString().padStart(2, '0'),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // Mois commence à 0
                    year: date.getFullYear().toString(),
                    hour: date.getHours().toString().padStart(2, '0'),
                    minute: date.getMinutes().toString().padStart(2, '0'),
                    second: date.getSeconds().toString().padStart(2, '0'),
                };

                return {
                    userId: log.userId,
                    date: decomposedDate,
                    componentName: log.componentName,
                };
            });
            res.status(200).send({
                message: "🚀 Logs de téléchargement récupérés avec succès",
                data: formattedLogs,
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des logs de téléchargement :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des logs de téléchargement",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des logs de téléchargement",
                });
            }
        }
    }
}

export default logsController;
