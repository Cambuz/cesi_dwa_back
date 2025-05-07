/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Récupérer tous les restaurants
 *     description: Permet de récupérer la liste de tous les restaurants disponibles.
 *     tags:
 *       - Restaurants
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des restaurants récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     example: "Restaurant Le Gourmet"
 *                   address:
 *                     type: string
 *                     example: "123 Rue de la Paix, Paris"
 *       404:
 *         description: Aucun restaurant trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /restaurants/types:
 *   get:
 *     summary: Récupérer tous les types de restaurants
 *     description: Permet de récupérer la liste de tous les types de restaurants disponibles.
 *     tags:
 *       - Types
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des types de restaurants récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     example: "Français"
 *       404:
 *         description: Aucun type de restaurant trouvé
 *       500:
 *         description: Erreur serveur
 */