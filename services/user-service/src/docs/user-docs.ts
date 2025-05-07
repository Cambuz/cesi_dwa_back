/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: Permet d'enregistrer un nouvel utilisateur dans la base de données.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               type:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inscription réussie"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     type:
 *                       type: string
 *                       example: "user"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Requête invalide (champs manquants ou invalides)
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Créer un utilisateur avec authentification
 *     description: Permet à un utilisateur authentifié de créer un nouvel utilisateur.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               type:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authentification de l'utilisateur
 *     description: Permet à un utilisateur de se connecter et de recevoir un token JWT.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     description: Permet de récupérer les informations d'un utilisateur spécifique.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     description: Permet de supprimer un utilisateur spécifique.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Modifier le solde d'un utilisateur
 *     description: Permet de modifier le solde d'un utilisateur spécifique
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newSolde
 *             properties:
 *               newSolde:
 *                 type: string
 *                 example: "214"
 *     responses:
 *       200:
 *         description: Solde mise à jour
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     description: Permet à un administrateur de récupérer tous les utilisateurs.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/ban/{id}:
 *   put:
 *     summary: Modifier la suspension d'un utilisateur
 *     description: Permet de modifier la suspension d'un utilisateur spécifique
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - banned
 *             properties:
 *               banned:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Etat de suspension mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/updatePassword/:
 *   put:
 *     summary: Mettre à jour le mot de passe d'un utilisateur
 *     description: Permet de modifier le mot de passe d'un utilisateur spécifique
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *               - uuid
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "password123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "newpassword123"
 *               uuid:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */