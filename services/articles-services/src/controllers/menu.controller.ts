import { Menu } from "../model/menu-model";
import { Article } from "../model/article-model";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

export async function getMenus(restaurantId: string) {
    try {
        const menus = await Menu.findAll({
            where: { restaurantId },
            include: [Article]
        });
        return menus;
    } catch (error) {
        console.error("Erreur lors de la récupération des menus:", error);
        throw error;
    }
}

export async function addMenu(menuData: any, req: any, res: any) {
    try {
        const allowedRoles = ['admin'];
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Accès refusé : non identifié' });
        }

        const decoded = jwt.verify(token, SECRET_KEY) as any;
        const id = decoded.id;

        if (id !== menuData.ownerId && !allowedRoles.includes(decoded.type)) {
            return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
        }

        const menuId = uuidv4();
        const menu = await Menu.create({
            id: menuId,
            ...menuData
        });
        return menu;
    } catch (error) {
        console.error("Erreur lors de la création du menu:", error);
        throw error;
    }
}

export async function editMenu(menuId: string, field: string, value: any, ownerId: string, req: any, res: any) {
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

        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            return res.status(404).json({ error: "Menu non trouvé" });
        }

        await menu.update({ [field]: value });
        return menu;
    } catch (error) {
        console.error("Erreur lors de la modification du menu:", error);
        throw error;
    }
}

export async function deleteMenu(menuId: string, ownerId: string, req: any, res: any) {
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

        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            return res.status(404).json({ error: "Menu non trouvé" });
        }

        await menu.destroy();
        return menu;
    } catch (error) {
        console.error("Erreur lors de la suppression du menu:", error);
        throw error;
    }
}

export async function addArticleToMenu(menuId: string, articleId: string, ownerId: string, req: any, res: any) {
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

        const menu = await Menu.findByPk(menuId);
        const article = await Article.findByPk(articleId);
        
        if (!menu || !article) {
            return res.status(404).json({ error: "Menu ou article non trouvé" });
        }
        
        await menu.$add('articles', article);
        return { menu, article };
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'article au menu:", error);
        throw error;
    }
}

export async function removeArticleFromMenu(menuId: string, articleId: string, ownerId: string, req: any, res: any) {
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

        const menu = await Menu.findByPk(menuId);
        const article = await Article.findByPk(articleId);
        
        if (!menu || !article) {
            return res.status(404).json({ error: "Menu ou article non trouvé" });
        }
        
        await menu.$remove('articles', article);
        return { menu, article };
    } catch (error) {
        console.error("Erreur lors du retrait de l'article du menu:", error);
        throw error;
    }
} 