/**
 * @swagger
 * components:
 *   schemas:
 *     Commande:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: "ID de la commande"
 *         clientId:
 *           type: string
 *           description: "ID du client"
 *         restaurantId:
 *           type: string
 *           description: "ID du restaurant"
 *         livreurId:
 *           type: string
 *           description: "ID du livreur (optionnel)"
 *         status:
 *           type: string
 *           enum: ["Pending", "Accepted", "In Delivery", "Completed", "Cancelled"]
 *           description: "Statut de la commande"
 *         cartPriceHT:
 *           type: number
 *           format: float
 *           description: "Prix total de la commande hors taxes"
 *         finalDeliveryTTC:
 *           type: number
 *           format: float
 *           description: "Prix de livraison final, toutes taxes comprises (optionnel)"
 *         finalPriceTTC:
 *           type: number
 *           format: float
 *           description: "Prix final de la commande, toutes taxes comprises (optionnel)"
 *         addressClient:
 *           type: string
 *           description: "Adresse du client"
 *         addressRestaurant:
 *           type: string
 *           description: "Adresse du restaurant"
 *         menus:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: "UUID du menu"
 *               uuid_restaurant:
 *                 type: string
 *                 description: "UUID du restaurant"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: "Quantité du menu"
 *         articles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: "UUID de l'article"
 *               uuid_restaurant:
 *                 type: string
 *                 description: "UUID du restaurant"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: "Quantité de l'article"
 */

/**
 * @swagger
 * tags:
 *   name: Commande
 *   description: API pour la gestion des commandes
 */

/**
 * @swagger
 * /commande/getCommand/{uuid}:
 *   get:
 *     tags:
 *       - Commande
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         description: ID de la commande
 *         schema:
 *           type: string
 *     summary: "Récupérer une commande"
 *     description: "Cette route permet de récupérer une commande."
 *     responses:
 *       200:
 *         description: "Commande récupérée avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commande'
 *       500:
 *         description: "Erreur interne du serveur"
 */

/**
 * @swagger
 * /commande/stats/restaurant/{uuid}:
 *   get:
 *     summary: Récupère les statistiques d'un restaurant
 *     tags:
 *       - Statistiques Restaurants
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         description: UUID du restaurant
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques d'un restaurant récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Statistiques du restaurant récupérées avec succès
 *                 stats:
 *                   type: object
 *                   properties:
 *                     Commandes:
 *                       type: integer
 *                       example: 10
 *                     Total:
 *                       type: number
 *                       format: float
 *                       example: 120.0
 *                     mostSoldArticleId:
 *                       type: string
 *                       example: article-uuid-1
 *                     leastSoldArticleId:
 *                       type: string
 *                       example: article-uuid-9
 *                     mostSoldMenuId:
 *                       type: string
 *                       example: menu-uuid-3
 *                     leastSoldMenuId:
 *                       type: string
 *                       example: menu-uuid-7
 *       400:
 *         description: UUID du restaurant manquant
 *       404:
 *         description: Aucune commande trouvée pour ce restaurant
 *       500:
 *         description: Erreur interne
 */
/**
 * @swagger
 * /commande/stats/getTransactionnal:
 *   get:
 *     summary: Récupère le chiffre d'affaires transactionnel en cours
 *     tags:
 *       - Statistiques Commandes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chiffre d'affaires transactionnel récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CA Transactionnel récupérée avec succès
 *                 Commandes en cours:
 *                   type: integer
 *                   example: 12
 *                 servicePrice:
 *                   type: number
 *                   format: float
 *                   example: 2.5
 *                 CA Transactionnel en cours:
 *                   type: number
 *                   format: float
 *                   example: 30.0
 *       401:
 *         description: Accès non autorisé
 *       403:
 *         description: Privilèges insuffisants
 *       500:
 *         description: Erreur interne
 */

/**
 * @swagger
 * /commande/stats/getGlobalCA:
 *   get:
 *     summary: Récupère le chiffre d'affaires global (en cours + historiques)
 *     tags:
 *       - Statistiques Commandes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chiffre d'affaires global récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CA Global récupérée avec succès
 *                 Commandes en cours:
 *                   type: integer
 *                   example: 5
 *                 Commandes totales:
 *                   type: integer
 *                   example: 30
 *                 servicePrice:
 *                   type: number
 *                   format: float
 *                   example: 2.5
 *                 CA Global:
 *                   type: number
 *                   format: float
 *                   example: 75.0
 *       401:
 *         description: Accès non autorisé
 *       403:
 *         description: Privilèges insuffisants
 *       500:
 *         description: Erreur interne
 */

 /**
 * @swagger
 * /commande/createCommande:
 *   post:
 *     tags:
 *       - Commande
 *     summary: "Créer une nouvelle commande"
 *     description: "Cette route permet de créer une nouvelle commande."
 *     operationId: "createCommande"
 *     requestBody:
 *       description: "Les informations nécessaires pour créer une commande"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: "ID du client"
 *               restaurantId:
 *                 type: string
 *                 description: "ID du restaurant"
 *               livreurId:
 *                 type: string
 *                 description: "ID du livreur (optionnel)"
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Accepted", "In Delivery", "Completed", "Cancelled"]
 *                 description: "Statut de la commande"
 *               cartPriceHT:
 *                 type: number
 *                 format: float
 *                 description: "Prix total de la commande hors taxes"
 *               finalPriceTTC:
 *                 type: number
 *                 format: float
 *                 description: "Prix final de la commande, toutes taxes comprises (optionnel)"
 *               menus:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       description: "UUID du menu"
 *                     uuid_restaurant:
 *                       type: string
 *                       description: "UUID du restaurant"
 *                     amount:
 *                       type: number
 *                       format: float
 *                       description: "Quantité du menu"
 *               articles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       description: "UUID de l'article"
 *                     uuid_restaurant:
 *                       type: string
 *                       description: "UUID du restaurant"
 *                     amount:
 *                       type: number
 *                       format: float
 *                       description: "Quantité de l'article"
 *     responses:
 *       201:
 *         description: "Commande créée avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Message de succès"
 *                 data:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: "Requête mal formée"
 *       500:
 *         description: "Erreur interne du serveur"
 */

/**
 * @swagger
 * /commande/getCommands:
 *   get:
 *     tags:
 *       - Commande
 *     summary: "Récupérer toutes les commandes"
 *     description: "Cette route permet de récupérer toutes les commandes existantes."
 *     responses:
 *       200:
 *         description: "Commandes récupérées avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commande'
 *       500:
 *         description: "Erreur interne du serveur"
 */

/**
 * @swagger
 * /commande/updateCommande:
 *   put:
 *     tags:
 *       - Commande
 *     summary: "Mettre à jour une commande"
 *     description: "Cette route permet de mettre à jour un paramètre spécifique d'une commande."
 *     requestBody:
 *       description: "Les informations nécessaires pour mettre à jour une commande"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commandId:
 *                 type: string
 *                 description: "ID de la commande à mettre à jour"
 *               param:
 *                 type: string
 *                 enum: ["status", "livreurId", "finalPriceTTC"]
 *                 description: "Le paramètre à mettre à jour"
 *               value:
 *                 type: string
 *                 description: "La nouvelle valeur pour le paramètre"
 *     responses:
 *       200:
 *         description: "Commande mise à jour avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Message de succès"
 *                 data:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: "Requête mal formée"
 *       404:
 *         description: "Commande non trouvée"
 *       500:
 *         description: "Erreur interne du serveur"
 */