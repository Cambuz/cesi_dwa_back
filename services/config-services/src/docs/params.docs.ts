/**
 * @swagger
 * tags:
 *   name: Paramètres
 *   description: Gestion des paramètres de configuration de l'application
 */

/**
 * @swagger
 * /config/getParams:
 *   get:
 *     summary: Récupère la liste de tous les paramètres
 *     tags: [Paramètres]
 *     responses:
 *       200:
 *         description: Liste des paramètres récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Liste des paramètres récupérée avec succès
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6613ec1f4968e93201a2f345
 *                       param:
 *                         type: string
 *                         example: deliveryPriceByKm
 *                       value:
 *                         type: number
 *                         example: 0.4
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Non autorisé
 *                 error:
 *                   type: string
 *                   example: <message d'erreur>
 *       500:
 *         description: Erreur lors de la récupération des paramètres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération des paramètres
 *                 error:
 *                   type: string
 *                   example: <message d'erreur>
 */

/**
 * @swagger
 * /config/getParam/{param}:
 *   get:
 *     summary: Récupère un paramètre spécifique par son nom
 *     tags: [Paramètres]
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du paramètre à récupérer
 *     responses:
 *       200:
 *         description: Paramètre trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Paramètre 'deliveryPriceByKm' trouvé
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6613ec1f4968e93201a2f345
 *                     param:
 *                       type: string
 *                       example: deliveryPriceByKm
 *                     value:
 *                       type: number
 *                       example: 0.4
 *       404:
 *         description: Paramètre non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Paramètre 'deliveryPriceByKm' non trouvé
 *       500:
 *         description: Erreur lors de la récupération du paramètre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération du paramètre 'deliveryPriceByKm'
 *                 error:
 *                   type: string
 *                   example: <message d'erreur>
 */
