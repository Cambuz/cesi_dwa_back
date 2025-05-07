/**
 * @openapi
 * components:
 *   schemas:
 *     Type:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         icon:
 *           type: string
 *
 *     Restaurant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         ownerId:
 *           type: string
 *           format: uuid
 *         logo:
 *           type: string
 *           nullable: true
 *         restaurantName:
 *           type: string
 *         address:
 *           type: string
 *         siret:
 *           type: string
 *         codePostal:
 *           type: string
 *         types:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Type'
 *
 *     RestaurantInput:
 *       type: object
 *       required:
 *         - ownerId
 *         - restaurantName
 *         - address
 *         - siret
 *         - codePostal
 *       properties:
 *         ownerId:
 *           type: string
 *         logo:
 *           type: string
 *           nullable: true
 *         restaurantName:
 *           type: string
 *         address:
 *           type: string
 *         siret:
 *           type: string
 *         codePostal:
 *           type: string
 *         types:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs de types à associer
 */

/**
 * @openapi
 * /restaurants/{ownerId}:
 *   get:
 *     summary: Obtenir un restaurant à partir de l'ownerId
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant non trouvé
 *       500:
 *         description: Erreur serveur
 *
 *   put:
 *     summary: Mettre à jour un restaurant existant
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantInput'
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Champs manquants
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Restaurant non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /restaurants/{ownerId}:
 *   delete:
 *     summary: Supprimer un restaurant
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant supprimé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Restaurant introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /restaurants:
 *   get:
 *     summary: Récupérer tous les restaurants
 *     responses:
 *       200:
 *         description: Liste de tous les restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       500:
 *         description: Erreur serveur
 *
 *   post:
 *     summary: Créer un nouveau restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantInput'
 *     responses:
 *       201:
 *         description: Restaurant créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Champs requis manquants
 *       500:
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /restaurants/types:
 *   get:
 *     summary: Récupérer tous les types de restaurants
 *     responses:
 *       200:
 *         description: Liste des types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Type'
 *       404:
 *         description: Aucun type trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
