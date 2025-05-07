/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Gestion des logs de connexion, des commandes et des téléchargements de composants
 */

/**
 * @swagger
 * /config/postLogLogin:
 *   post:
 *     summary: Enregistrer un log de connexion
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uuid
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: UUID de l'utilisateur
 *               name:
 *                 type: string
 *                 description: Nom de l'utilisateur
 *               type:
 *                 type: string
 *                 description: Type de l'utilisateur (admin, livreur, client)
 *     responses:
 *       200:
 *         description: Log de connexion enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Erreur lors de l'enregistrement du log
 */

/**
 * @swagger
 * /config/getLogsLogin:
 *   get:
 *     summary: Récupérer tous les logs de connexion (admin uniquement)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des logs de connexion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uuid:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       date:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                           month:
 *                             type: string
 *                           year:
 *                             type: string
 *                           hour:
 *                             type: string
 *                           minute:
 *                             type: string
 *                           second:
 *                             type: string
 *       401:
 *         description: Accès refusé - non identifié
 *       403:
 *         description: Accès refusé - privilèges insuffisants
 *       500:
 *         description: Erreur interne
 */

/**
 * @swagger
 * /config/getLogsLoginByUser/{uuid}:
 *   get:
 *     summary: Récupérer les logs de connexion d’un utilisateur (admin uniquement)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         description: UUID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des logs de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uuid:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       date:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                           month:
 *                             type: string
 *                           year:
 *                             type: string
 *                           hour:
 *                             type: string
 *                           minute:
 *                             type: string
 *                           second:
 *                             type: string
 *       404:
 *         description: Aucun log trouvé
 *       401:
 *         description: Non identifié
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur interne
 */

/**
 * @swagger
 * /config/getLastLogin/{uuid}:
 *   get:
 *     summary: Récupérer la dernière connexion d’un utilisateur (admin ou soi-même)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         description: UUID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dernière connexion trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                     date:
 *                       type: object
 *                       properties:
 *                         day:
 *                           type: string
 *                         month:
 *                           type: string
 *                         year:
 *                           type: string
 *                         hour:
 *                           type: string
 *                         minute:
 *                           type: string
 *                         second:
 *                           type: string
 *       404:
 *         description: Aucun log trouvé
 *       401:
 *         description: Non identifié
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur interne
 */

/**
 * @swagger
 * /config/postLogCommand:
 *   post:
 *     summary: Enregistrer un log de commande
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uuid
 *               - uuid_client
 *               - uuid_livreur
 *               - uuid_restaurant
 *               - final_status
 *               - prixCart
 *               - prixTTC
 *               - articles
 *               - menus
 *             properties:
 *               uuid:
 *                 type: string
 *               uuid_client:
 *                 type: string
 *               uuid_livreur:
 *                 type: string
 *               uuid_restaurant:
 *                 type: string
 *               final_status:
 *                 type: string
 *               prixTTC:
 *                 type: number
 *               articles:
 *                 type: array
 *                 items:
 *                   type: object
 *               menus:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Log de commande enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Erreur lors de l'enregistrement
 */

/**
 * @swagger
 * /config/getLogsCommand:
 *   get:
 *     summary: Récupérer tous les logs de commande (admin uniquement)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des logs de commande
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uuid_client:
 *                         type: string
 *                       uuid_livreur:
 *                         type: string
 *                       uuid_restaurant:
 *                         type: string
 *                       date:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                           month:
 *                             type: string
 *                           year:
 *                             type: string
 *                           hour:
 *                             type: string
 *                           minute:
 *                             type: string
 *                           second:
 *                             type: string
 *                       final_status:
 *                         type: string
 *                       prixCart:
 *                         type: number
 *                       prixTTC:
 *                         type: number
 *                       articles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             uuid:
 *                               type: string
 *                             uuid_restaurant:
 *                               type: string
 *                       menus:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             uuid:
 *                               type: string
 *                             uuid_restaurant:
 *                               type: string
 *       401:
 *         description: Non identifié
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /config/postLogDownload:
 *   post:
 *     summary: Enregistrer un log de téléchargement
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               componentName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Log de commande enregistré avec succès
 *       500:
 *         description: Erreur lors de l'enregistrement
 */

/**
 * @swagger
 * /config/getLogsDownload:
 *   get:
 *     summary: Récupérer tous les logs de téléchargement
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des logs de commande
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: UUID de l'utilisateur
 *                       date:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                           month:
 *                             type: string
 *                           year:
 *                             type: string
 *                           hour:
 *                             type: string
 *                           minute:
 *                             type: string
 *                           second:
 *                             type: string
 *
 *
 *       401:
 *         description: Non identifié
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */