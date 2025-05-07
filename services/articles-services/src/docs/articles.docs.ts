/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - BearerAuth: []
 */

/**
 * @openapi
 * tags:
 *   - name: Articles
 *     description: Routes liées aux articles
 *   - name: Menus
 *     description: Routes liées aux menus
 */

/**
 * @openapi
 * /articles/articles/delete:
 *   delete:
 *     tags:
 *       - Articles
 *     summary: Supprime un article
 *     description: Supprime un article à partir de son UUID et de l'ID du propriétaire.
 *     parameters:
 *       - name: uuid
 *         in: query
 *         required: true
 *         description: UUID de l'article à supprimer.
 *         schema:
 *           type: string
 *       - name: ownerId
 *         in: query
 *         required: true
 *         description: ID du propriétaire de l'article.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "cf1867b5-6f78-4229-8cf5-34e785c8c39b"
 *       401:
 *         description: Accès refusé ! non identifié
 *       403:
 *         description: Accès refusé ! privilèges insuffisants
 *       404:
 *         description: Article non trouvé
 */

/**
 * @openapi
 * /articles/articles/add:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Ajoute un article
 *     description: Crée un nouvel article dans le système.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: string
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *                 format: float
 *               type:
 *                 type: string
 *               restaurantId:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "56450589-afe2-4cb6-9c1f-ce14bc0d89f5"
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Accès refusé ! non identifié
 *       403:
 *         description: Accès refusé ! privilèges insuffisants
 */

/**
 * @openapi
 * /articles/articles/edit:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Modifie un article
 *     description: Modifie un champ d'un article existant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *               field:
 *                 type: string
 *               value:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article modifié avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "56450589-afe2-4cb6-9c1f-ce14bc0d89f5"
 *       401:
 *         description: Accès refusé ! non identifié
 *       403:
 *         description: Accès refusé ! privilèges insuffisants
 *       404:
 *         description: Article non trouvé
 */

/**
 * @openapi
 * /articles/articles/getall:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Récupère tous les articles pour un restaurant
 *     description: Récupère tous les articles associés à un restaurant en utilisant le restaurantId.
 *     parameters:
 *       - name: uuid
 *         in: query
 *         required: true
 *         description: UUID du restaurant.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des articles récupérés.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "56450589-afe2-4cb6-9c1f-ce14bc0d89f5"
 *                   nom:
 *                     type: string
 *                     example: "Pizza Margherita"
 *                   description:
 *                     type: string
 *                     example: "Pizza traditionnelle avec tomate, mozzarella et basilic"
 *                   logo:
 *                     type: string
 *                   prix:
 *                     type: number
 *                     format: float
 *                     example: 12.50
 *       404:
 *         description: Aucun article trouvé
 */

/**
 * @openapi
 * /articles/menus/getall:
 *   get:
 *     tags:
 *       - Menus
 *     summary: Récupère tous les menus d'un restaurant
 *     description: Récupère tous les menus associés à un restaurant en utilisant le restaurantId.
 *     parameters:
 *       - name: uuid
 *         in: query
 *         required: true
 *         description: UUID du restaurant.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des menus récupérés.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "ad053a05-2ca0-4593-bfef-e4995b9c19b9"
 *                   nom:
 *                     type: string
 *                     example: "Menu du Jour"
 *                   logo:
 *                     type: string
 *                   prix:
 *                     type: number
 *                     format: float
 *                     example: 25.00
 *       404:
 *         description: Aucun menu trouvé
 */

/**
 * @openapi
 * /articles/menus/add:
 *   post:
 *     tags:
 *       - Menus
 *     summary: Crée un menu
 *     description: Crée un nouveau menu pour un restaurant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prix:
 *                 type: number
 *                 format: float
 *               restaurantId:
 *                 type: string
 *               ownerId:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "ad053a05-2ca0-4593-bfef-e4995b9c19b9"
 *       400:
 *         description: Données invalides
 */

/**
 * @openapi
 * /articles/menus/edit:
 *   post:
 *     tags:
 *       - Menus
 *     summary: Modifie un menu
 *     description: Modifie un champ d'un menu existant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *               field:
 *                 type: string
 *               value:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu modifié avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "ad053a05-2ca0-4593-bfef-e4995b9c19b9"
 *       401:
 *         description: Accès refusé ! non identifié
 *       403:
 *         description: Accès refusé ! privilèges insuffisants
 *       404:
 *         description: Menu non trouvé
 */

/**
 * @openapi
 * /articles/menus/delete:
 *   delete:
 *     tags:
 *       - Menus
 *     summary: Supprime un menu
 *     description: Supprime un menu à partir de son UUID et de l'ID du propriétaire.
 *     parameters:
 *       - name: uuid
 *         in: query
 *         required: true
 *         description: UUID du menu à supprimer.
 *         schema:
 *           type: string
 *       - name: ownerId
 *         in: query
 *         required: true
 *         description: ID du propriétaire du menu.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu supprimé avec succès.
 *       401:
 *         description: Accès refusé ! non identifié
 *       403:
 *         description: Accès refusé ! privilèges insuffisants
 *       404:
 *         description: Menu non trouvé
 */

/**
 * @openapi
 * /articles/menus/addarticles:
 *   post:
 *     tags:
 *       - Menus
 *     summary: Ajoute un article à un menu
 *     description: Ajoute un article à un menu existant dans le restaurant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menuId:
 *                 type: string
 *               articleId:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article ajouté au menu avec succès.
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Menu ou article non trouvé
 *       401:
 *         description: Accès refusé ! non identifié
 *       403:
 *         description: Accès refusé ! privilèges insuffisants
 */

