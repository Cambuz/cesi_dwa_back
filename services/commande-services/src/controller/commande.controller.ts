import { Request, Response } from "express";
import { Commande } from "../models/commande.model";
import jwt from 'jsonwebtoken';
import {Op} from "sequelize";

const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

const logsController = {

    createCommande: async (req: Request, res: Response): Promise<any> => {
        try {
            const { clientId, restaurantId, livreurId, status, cartPriceHT, finalDeliveryTTC, finalPriceTTC, addressClient, addressRestaurant, menus, articles } = req.body;

            // Vérification de la présence des données obligatoires
            if (!clientId || !restaurantId || !status || !cartPriceHT || !addressClient || !addressRestaurant) {
                return res.status(400).send({
                    message: "Les champs 'clientId', 'restaurantId', 'status', 'addressClient', 'addressRestaurant' et 'cartPriceHT' sont obligatoires"
                });
            }

            // Création de la nouvelle commande
            const newCommande = await Commande.create({
                clientId,
                restaurantId,
                livreurId: livreurId || null, // livreurId est optionnel
                status,
                cartPriceHT,
                finalDeliveryTTC: finalDeliveryTTC || null, // finalDeliveryTTC est optionnel
                finalPriceTTC: finalPriceTTC || null, // finalPriceTTC est optionnel
                addressClient,
                addressRestaurant,
                menus,
                articles
            });


            //On envoie une notification au restaurant
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }
            await fetch("http://config-services:3007/config/postNotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: restaurantId,
                    type: "info",
                    title: "Nouvelle commande",
                    message: `Vous avez une nouvelle commande à traiter`,
                }),
            }).catch(err => {
                console.error("❌ Erreur lors de l'envoi du de la notification :", err);
            });

            // Réponse de succès
            res.status(201).send({
                message: "Commande créée avec succès",
                data: newCommande
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la création de la commande :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la création de la commande",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue lors de la création de la commande");
                res.status(500).send({
                    message: "Erreur inconnue lors de la création de la commande"
                });
            }
        }
    },

    getCommandById: async (req: Request, res: Response): Promise<any> => {
        try {
            //On récupère une seule commande par l'uuid passé dans l'url
            const { uuid } = req.params;

            if(!uuid) {
                return res.status(400).send({
                    message: "L'UUID de la commande est obligatoire"
                });
            }

            const commande = await Commande.findOne({ where: { id: uuid } });
            if (!commande) {
                return res.status(404).send({
                    message: "Commande non trouvée"
                });
            }
            res.status(200).send({
                message: "Commande récupérée avec succès",
                data: commande
            });


        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération de la commande :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération de la commande",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue lors de la récupération de la commande");
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération de la commande"
                });
            }
        }
    },

    getCommands: async (req: Request, res: Response): Promise<any> => {
        try {
            const commandes = await Commande.findAll();

            //Si status === "Completed" || "Cancelled": on enregistre un log de la commande. On supprime la commande en SQL
            commandes.forEach(async (commande: any) => {
                if (commande.status === "Completed" || commande.status === "Cancelled") {
                    await fetch("http://config-services:3007/config/postLogCommand", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${req.headers.authorization?.split(' ')[1]}`,
                        },
                        body: JSON.stringify({
                            uuid: commande.id,
                            uuid_client: commande.clientId,
                            uuid_restaurant: commande.restaurantId,
                            uuid_livreur: commande.livreurId,
                            final_status: commande.status,
                            prixCart: commande.cartPriceHT,
                            prixTTC: commande.finalPriceTTC,
                            menus: commande.menus,
                            articles: commande.articles
                        }),
                    }).catch(err => {
                        console.error("❌ Erreur lors de l'envoi du log de la commande :", err);
                    });
                    await Commande.destroy({ where: { id: commande.id } });
                }
            });

            //On récupère de nouveau les commandes
            const commandesActual = await Commande.findAll();


            res.status(200).send({
                message: "Commandes récupérées avec succès",
                data: commandesActual
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des commandes :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des commandes",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue lors de la récupération des commandes");
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des commandes"
                });
            }
        }
    },

    updateCommande: async (req: Request, res: Response): Promise<any> => {
        try {
            const commandId = req.params.id;
            const { clientId, restaurantId, livreurId, status, cartPriceHT, finalPriceTTC, menus, articles } = req.body;

            if (!commandId) {
                return res.status(400).send({
                    message: "L'ID de la commande est obligatoire dans l'URL"
                });
            }

            const commande = await Commande.findByPk(commandId);

            if (!commande) {
                return res.status(404).send({
                    message: "Commande non trouvée"
                });
            }

            // Vérification du statut si présent dans les données de mise à jour
            if (status) {
                const validStatuses = ["Pending", "Accepted", "In Delivery", "Completed", "Cancelled"];
                if (!validStatuses.includes(status)) {
                    return res.status(400).send({
                        message: "Le champ 'status' doit être 'Pending', 'Accepted', 'In Delivery', 'Completed' ou 'Cancelled'"
                    });
                }

                // Vérification pour l'annulation
                if (status === "Cancelled" && commande.status !== "Pending") {
                    return res.status(400).send({
                        message: "Impossible d'annuler une commande qui n'est pas dans l'état 'Pending'"
                    });
                }
            }

            // On va appeler l'API pour notifier un utilisateur en fonction du cas
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            // Gestion des notifications en fonction du changement de statut
            if (status) {
                switch (status) {
                    case "Accepted":
                        await fetch("http://config-services:3007/config/postNotification", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                userId: commande.clientId,
                                type: "success",
                                title: "Votre commande a été acceptée",
                                message: `Votre commande a été acceptée par le restaurant`,
                            }),
                        }).catch(err => {
                            console.error("❌ Erreur lors de l'envoi de la notification :", err);
                        });
                        break;

                    case "In Delivery":
                        await fetch("http://config-services:3007/config/postNotification", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                userId: commande.clientId,
                                type: "info",
                                title: "Votre commande est en cours de livraison",
                                message: `Votre commande est en cours de livraison, le livreur arrivera bientôt`,
                            }),
                        }).catch(err => {
                            console.error("❌ Erreur lors de l'envoi de la notification :", err);
                        });
                        break;

                    case "Completed":
                        await fetch("http://config-services:3007/config/postNotification", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                userId: commande.clientId,
                                type: "success",
                                title: "Bon appetit !",
                                message: `Votre commande a été livrée avec succès`,
                            }),
                        }).catch(err => {
                            console.error("❌ Erreur lors de l'envoi de la notification :", err);
                        });

                        await fetch("http://config-services:3007/config/postNotification", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                userId: commande.livreurId,
                                type: "success",
                                title: "Commande livrée !",
                                message: `La commande a bien été livrée`,
                            }),
                        }).catch(err => {
                            console.error("❌ Erreur lors de l'envoi de la notification :", err);
                        });
                        break;
                }
            }

            // Mise à jour complète de la commande
            await commande.update({
                clientId,
                restaurantId,
                livreurId,
                status,
                cartPriceHT,
                finalPriceTTC,
                menus,
                articles
            });

            res.status(200).send({
                message: "Commande mise à jour avec succès",
                data: commande
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la mise à jour de la commande :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la mise à jour de la commande",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue lors de la mise à jour de la commande");
                res.status(500).send({
                    message: "Erreur inconnue lors de la mise à jour de la commande"
                });
            }
        }
    },

    getTransactional: async (req: Request, res: Response): Promise<any> => {
        try {

            const allowedRoles = ['admin', 'commercial'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            if (!allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            // On récupère l'ensemble des commandes dont le status !== completed || status !== cancelled
            const commandes = await Commande.findAll({
                where: {
                    status: {
                        [Op.not]: ["Completed", "Cancelled"]
                    }
                }
            });

            // On doit récupérer le nombre de commandes récupérées
            const commandesEnCoursAmount = commandes.length;

            // Maintenant que l'on a le nombre de commandes en cours, on va récupérer le paramètre frais de service en appelant l'API
            // On récupère le paramètre
            const response = await fetch("http://config-services:3007/config/getParam/servicePrice", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }).catch(err => {
                console.error("❌ Erreur lors de la récupération du paramètre :", err);
                return res.status(500).json({ error: "Erreur interne lors de la récupération du paramètre" });
            });

            // Vérifier si la réponse est réussie
            if (response && response.status === 200) {
                const responseData = await response.json();

                // Extraire data.value
                const servicePrice = responseData?.data?.value;

                // Si le servicePrice est disponible, on peut l'utiliser dans la logique suivante
                if (servicePrice !== undefined) {
                    console.log("Frais de service récupérés :", servicePrice);

                    //On va calculer le montant total transactionnel en cours
                    const totalTransactionnal = servicePrice * commandesEnCoursAmount;

                    res.status(200).json({
                        message: "CA Transactionnel récupérée avec succès",
                        "Commandes en cours": commandesEnCoursAmount,
                        "servicePrice": servicePrice,
                        "CA Transactionnel en cours": totalTransactionnal
                    });
                } else {
                    return res.status(404).json({ error: "Paramètre 'servicePrice' introuvable" });
                }
            } else {
                return res.status(500).json({ error: "Erreur lors de la récupération du paramètre servicePrice" });
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des logs transactionnels :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des logs transactionnels",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue lors de la récupération des logs transactionnels");
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des logs transactionnels"
                });
            }
        }
    },

    getGlobalCA: async (req: Request, res: Response): Promise<any> => {
        try {

            const allowedRoles = ['admin', 'commercial'];
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Accès refusé : non identifié' });
            }

            const decoded = jwt.verify(token, SECRET_KEY) as any;

            if (!allowedRoles.includes(decoded.type)) {
                return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
            }

            // On récupère l'ensemble des commandes dont le status !== completed || status !== cancelled
            const commandes = await Commande.findAll({
                where: {
                    status: {
                        [Op.not]: ["Completed", "Cancelled"]
                    }
                }
            });

            // On doit récupérer le nombre de commandes récupérées
            const commandesEnCoursAmount = commandes.length;

            //On cherche maintenant à récuperer les logs de toutes les commandes via un appel API
            const response = await fetch("http://config-services:3007/config/getLogsCommand", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }).catch(err => {
                console.error("❌ Erreur lors de la récupération du paramètre :", err);
                return res.status(500).json({ error: "Erreur interne lors de la récupération du paramètre" });
            });

            // Vérifier si la réponse est réussie
            if (response && response.status === 200) {
                const responseData = await response.json();

                //On va maintenant compter le nombre de commandes récupérées
                const commandesCount = responseData?.data?.length;

                //On fait la somme pour obtenir le nombre total de commandes
                const totalCommands = commandesCount + commandesEnCoursAmount;

                //On va maintenant récuperer la valeur du paramètre frais de service

                const paramResponse = await fetch("http://config-services:3007/config/getParam/servicePrice", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }).catch(err => {
                    console.error("❌ Erreur lors de la récupération du paramètre :", err);
                    return res.status(500).json({ error: "Erreur interne lors de la récupération du paramètre" });
                });

                if (paramResponse && paramResponse.status === 200) {
                    const responseDataParam = await paramResponse.json();

                    // Extraire data.value
                    const servicePrice = responseDataParam?.data?.value;

                    //Maintenant on calcul le CA Global
                    const CAGlobal = servicePrice * totalCommands;

                    //On renvoie les résultats
                    res.status(200).json({
                        message: "CA Global récupérée avec succès",
                        "Commandes en cours": commandesEnCoursAmount,
                        "Commandes totales": totalCommands,
                        "servicePrice": servicePrice,
                        "CA Global": CAGlobal
                    });
                } else {
                    return res.status(500).json({ error: "Erreur lors de la récupération du paramètre servicePrice" });
                }
            } else {
                return res.status(500).json({ error: "Erreur lors de la récupération des commandes en logs" });
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des logs transactionnels :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des logs transactionnels",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue lors de la récupération des logs transactionnels");
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des logs transactionnels"
                });
            }
        }
    },

    getRestaurantStats: async (req: Request, res: Response): Promise<any> => {
        try {
            const { uuid } = req.params;

            // Vérification que l'UUID du restaurant est bien présent
            if (!uuid) {
                return res.status(400).send({
                    message: "L'UUID du restaurant est obligatoire"
                });
            }

            // On va maintenant récupérer les logs de toutes les commandes via un appel API
            const response = await fetch("http://config-services:3007/config/getLogsCommand", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${req.headers.authorization?.split(' ')[1]}`,
                },
            }).catch(err => {
                console.error("❌ Erreur lors de la récupération des logs :", err);
                return res.status(500).json({ error: "Erreur interne lors de la récupération des logs" });
            });

            // Vérification si la réponse est réussie
            if (response && response.status === 200) {

                // On récupère les données des commandes
                const responseData = await response.json();
                const commandes = responseData?.data || [];
                const commandesAmount = commandes.length;

                // Filtrer les commandes par uuid_restaurant
                const filteredCommandes = commandes.filter((commande: any) => commande.uuid_restaurant === uuid);

                // Si aucune commande ne correspond, retourner une réponse adéquate
                if (filteredCommandes.length === 0) {
                    return res.status(404).json({ message: "Aucune commande trouvée pour ce restaurant" });
                }

                // Initialisation des variables pour les statistiques
                let articleSales: { [key: string]: number } = {};
                let menuSales: { [key: string]: number } = {};
                let totalSales = 0;

                // Parcours de toutes les commandes filtrées
                filteredCommandes.forEach((commande: any) => {
                    // Calcul des ventes totales avec prixTTC
                    totalSales += parseFloat(commande.prixTTC) || 0;

                    // Comptabilisation des articles
                    commande.articles.forEach((article: any) => {
                        if (article.uuid_restaurant === uuid) {
                            articleSales[article.uuid] = (articleSales[article.uuid] || 0) + 1;
                        }
                    });

                    // Comptabilisation des menus
                    commande.menus.forEach((menu: any) => {
                        if (menu.uuid_restaurant === uuid) {
                            menuSales[menu.uuid] = (menuSales[menu.uuid] || 0) + 1;
                        }
                    });
                });

                // Trouver l'article le plus vendu et le moins vendu
                const mostSoldArticleId = Object.keys(articleSales).reduce((a, b) => articleSales[a] > articleSales[b] ? a : b, "");
                const leastSoldArticleId = Object.keys(articleSales).reduce((a, b) => articleSales[a] < articleSales[b] ? a : b, "");

                // Trouver le menu le plus vendu et le moins vendu
                const mostSoldMenuId = Object.keys(menuSales).reduce((a, b) => menuSales[a] > menuSales[b] ? a : b, "");
                const leastSoldMenuId = Object.keys(menuSales).reduce((a, b) => menuSales[a] < menuSales[b] ? a : b, "");

                // Préparer la réponse avec toutes les statistiques calculées
                res.status(200).json({
                    message: "Statistiques du restaurant récupérées avec succès",
                    stats: {
                        "Commandes": filteredCommandes.length, // Nombre total de commandes filtrées
                        "Total": totalSales, // Vente totale
                        mostSoldArticleId, // ID de l'article le plus vendu
                        leastSoldArticleId, // ID de l'article le moins vendu
                        mostSoldMenuId, // ID du menu le plus vendu
                        leastSoldMenuId, // ID du menu le moins vendu
                    }
                });

            } else {
                return res.status(500).json({ error: "Erreur lors de la récupération des logs des commandes" });
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération des stats restaurant :", error.message);
                res.status(500).send({
                    message: "Erreur lors de la récupération des stats restaurant",
                    error: error.message
                });
            } else {
                console.error("❌ Erreur inconnue lors de la récupération des stats restaurant");
                res.status(500).send({
                    message: "Erreur inconnue lors de la récupération des stats restaurant"
                });
            }
        }
    }

};

export default logsController;
