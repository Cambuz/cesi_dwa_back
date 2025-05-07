import express from "express";
import * as articleController from "../controllers/article.controller";
import * as menuController from "../controllers/menu.controller";

const router = express.Router();

//Récuperer les articles d'un restaurant
router.get('/articles/getall', async (req: any, res: any) => {
    try {
        const { uuid: restaurantId } = req.query;
        const articles = await articleController.getArticles(restaurantId);
        res.json(articles);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});


router.post('/articles/add', async (req: any, res: any) => {
    try {
        const { ownerId, nom, description, prix, type, restaurantId, logo } = req.body;
        const article = await articleController.addArticle({ nom, description, prix, type, restaurantId, ownerId, logo: logo || null }, req, res);
        res.status(201).json({ message: "Article créé", article });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

router.delete('/articles/delete', async (req: any, res: any) => {
    try {
        const { uuid: articleId, ownerId } = req.body;
        const article = await articleController.deleteArticle(articleId, ownerId, req, res);
        res.json({ message: "Article supprimé", article });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

router.post('/articles/edit', async (req: any, res: any) => {
    try {
        const { uuid: articleId, field, value, ownerId } = req.body;
        const article = await articleController.editArticle(articleId, field, value, ownerId, req, res);
        res.json({ message: "Article modifié", article });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

//Récupérer tous les menus d'un restaurant
router.get('/menus/getall', async (req: any, res: any) => {
    try {
        const { uuid: restaurantId } = req.query;
        const menus = await menuController.getMenus(restaurantId);
        res.json(menus);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

//Créer un menu pour un restaurant
router.post('/menus/add', async (req: any, res: any) => {
    try {
        const { nom, prix, restaurantId, ownerId, logo } = req.body;
        const menu = await menuController.addMenu({ nom, prix, restaurantId, ownerId, logo: logo || null }, req, res);
        res.status(201).json({ message: "Menu créé", menu });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

//Modifier un menu d'un restaurant
router.post('/menus/edit', async (req: any, res: any) => {
    try {
        const { uuid: menuId, field, value, ownerId } = req.body;
        const menu = await menuController.editMenu(menuId, field, value, ownerId, req, res);
        res.json({ message: "Menu modifié", menu });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

//Supprimer un menu d'un restaurant
router.delete('/menus/delete', async (req: any, res: any) => {
    try {
        const { uuid: menuId, ownerId } = req.body;
        const menu = await menuController.deleteMenu(menuId, ownerId, req, res);
        res.json({ message: "Menu supprimé", menu });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

//Ajouter un article à un menu d'un restaurant
router.post('/menus/addarticles', async (req: any, res: any) => {
    try {
        const { uuid: menuId, articleId, ownerId } = req.body;
        const result = await menuController.addArticleToMenu(menuId, articleId, ownerId, req, res);
        res.json({ message: "Article ajouté au menu", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

//Retirer un article d'un menu d'un restaurant  
router.post('/menus/deletearticles', async (req: any, res: any) => {
    try {
        const { uuid: menuId, articleId, ownerId } = req.body;
        const result = await menuController.removeArticleFromMenu(menuId, articleId, ownerId, req, res);
        res.json({ message: "Article retiré du menu", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

export default router; 