/**
 * @swagger
 * tags:
 *   name: Client
 *   description: API pour la gestion des clients
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - userId
 *         - address
 *         - codePostal
 *         - phone
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         address:
 *           type: string
 *         codePostal:
 *           type: string
 *         phone:
 *           type: string
 */

/**
 * @swagger
 * /client/{uuid}:
 *   get:
 *     summary: Récupère un client via son UUID utilisateur
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID de l'utilisateur lié au client
 *     responses:
 *       200:
 *         description: Client trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client non trouvé
 *   delete:
 *     summary: Supprime un client via son UUID utilisateur
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID de l'utilisateur lié au client
 *     responses:
 *       200:
 *         description: Client supprimé
 *       404:
 *         description: Client non trouvé
 *   put:
 *     summary: Met à jour un client via son UUID utilisateur
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID de l'utilisateur lié au client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client non trouvé
 */

/**
 * @swagger
 * /client/:
 *   post:
 *     summary: Crée un nouveau client
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID de l'utilisateur lié au client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Client créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       500:
 *         description: Erreur serveur
 *   get:
 *     summary: Récupère tous les clients
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: Liste des clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
