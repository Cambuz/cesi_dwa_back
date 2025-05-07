/**
 * @swagger
 * tags:
 *   name: Livreur
 *   description: API pour la gestion des livreurs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LivreurInput:
 *       type: object
 *       required:
 *         - userId
 *         - phone
 *         - vehicule
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         phone:
 *           type: string
 *         vehicule:
 *           type: string
 *       example:
 *         userId: "9c84ee64-bdf3-4046-a4b5-0c1086f3d8cf"
 *         phone: "+33612345678"
 *         vehicule: "scooter"
 *     Livreur:
 *       type: object
 *       required:
 *         - userId
 *         - phone
 *         - vehicule
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         phone:
 *           type: string
 *         vehicule:
 *           type: string
 *       example:
 *         id: "7e9b2df1-8e7d-4d73-bc58-a3f1d0e48b01"
 *         userId: "9c84ee64-bdf3-4046-a4b5-0c1086f3d8cf"
 *         phone: "+33612345678"
 *         vehicule: "scooter"
 */

/**
 * @swagger
 * /livreur/getLivreurByUserId/{uuid}:
 *   get:
 *     summary: Récupère un livreur via son UUID utilisateur
 *     tags: [Livreur]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID de l'utilisateur lié au livreur
 *     responses:
 *       200:
 *         description: Livreur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livreur'
 *       404:
 *         description: Livreur non trouvé
 */

/**
 * @swagger
 * /livreur/deleteLivreurByUserId/{uuid}:
 *   delete:
 *     summary: Supprime un livreur via son UUID utilisateur
 *     tags: [Livreur]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID de l'utilisateur lié au livreur
 *     responses:
 *       200:
 *         description: Livreur supprimé
 *       404:
 *         description: Livreur non trouvé
 */

/**
 * @swagger
 * /livreur/updateLivreurByUserId/{uuid}:
 *   post:
 *     summary: Met à jour un livreur via son UUID utilisateur
 *     tags: [Livreur]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID de l'utilisateur lié au livreur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livreur'
 *     responses:
 *       200:
 *         description: Livreur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livreur'
 *       404:
 *         description: Livreur non trouvé
 */

/**
 * @swagger
 * /livreur/{uuid}:
 *   post:
 *     summary: Crée un nouveau livreur
 *     tags: [Livreur]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID de l'utilisateur lié au livreur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LivreurInput'
 *     responses:
 *       201:
 *         description: Livreur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livreur'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /livreur/getAll:
 *   get:
 *     summary: Récupère tous les livreurs
 *     tags: [Livreur]
 *     responses:
 *       200:
 *         description: Liste des livreurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livreur'
 */
