import { Article } from "../model/article-model";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";
// Articles
export async function getArticles(restaurantId: string) {
    try {
        const articles = await Article.findAll({
            where: { restaurantId }
        });
        return articles;
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        throw error;
    }
}

export async function addArticle(articleData: any, req: any, res: any) {
    try {
        const allowedRoles = ['admin'];
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Accès refusé : non identifié' });
        }

        const decoded = jwt.verify(token, SECRET_KEY) as any;
        const id = decoded.id;

        if (id !== articleData.ownerId && !allowedRoles.includes(decoded.type)) {
            return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
        }

        const articleId = uuidv4();
        const article = await Article.create({
            id: articleId,
            ...articleData
        });
        return article;
    } catch (error) {
        console.error("Erreur lors de la création de l'article:", error);
        throw error;
    }
}

export async function editArticle(articleId: string, field: string, value: any, ownerId: string, req: any, res: any) {
    try {
        const allowedRoles = ['admin'];
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Accès refusé : non identifié' });
        }

        const decoded = jwt.verify(token, SECRET_KEY) as any;
        const id = decoded.id;

        if (id !== ownerId && !allowedRoles.includes(decoded.type)) {
            return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
        }

        const article = await Article.findByPk(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article non trouvé" });
        }

        await article.update({ [field]: value });
        return article;
    } catch (error) {
        console.error("Erreur lors de la modification de l'article:", error);
        throw error;
    }
}

export async function deleteArticle(articleId: string, ownerId: string, req: any, res: any) {
    try {
        const allowedRoles = ['admin'];
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Accès refusé : non identifié' });
        }

        const decoded = jwt.verify(token, SECRET_KEY) as any;
        const id = decoded.id;

        if (id !== ownerId && !allowedRoles.includes(decoded.type)) {
            return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
        }

        const article = await Article.findByPk(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article non trouvé" });
        }

        await article.destroy();
        return article;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'article:", error);
        throw error;
    }
} 