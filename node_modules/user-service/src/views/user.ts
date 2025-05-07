import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUser } from "../controlleur/user";
import { User } from "../model/user-model";
import { UserType } from "../model/user-type";
import axios from "axios";
import { BASE_URLS } from "../conf/route";

const router = express.Router();
const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

// Routes spécifiques sans paramètres
router.post('/register', async (req: any, res: any) => {
    const { name, email, password, type, extra } = req.body;
    try {
        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        const userConfig = { name, email, password, type, extra };
        const { user, token } = await addUser(res, userConfig, true, userConfig.type);

        //Si le type du nouvel utilisateur est client:
        if (user.type === UserType.CLIENT) {
            //On va envoyer une notification à tous les utilisateurs de type service technique
            const users = await User.findAll({ where: { type: UserType.TECHNIQUE } });
            users.forEach(async (user) => {
                await fetch("http://config-services:3007/config/postNotification", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        type: "info",
                        message: `Un client vient de s'inscrire`,
                    }),
                }).catch(err => {
                    console.error("❌ Erreur lors de l'envoi de la notification :", err);
                });
            });
        }


        res.status(201).json({ message: "Inscription réussie", user, token });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

router.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Aucun identifiants existant' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Identifiants incorrects' });

    const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, SECRET_KEY, { expiresIn: '4h' });

      // Enregistrement de la connexion en log via appel API externe
      await fetch("http://config-services:3007/config/postLogLogin", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ uuid: user.id }),
      }).catch(err => {
          console.error("❌ Erreur lors de l'envoi du log de connexion :", err);
      });

      //On contrôle le type de l'utilisateur
      //Si le type est developpeur
        if (user.type === UserType.DEVELOPPEUR) {
            //On va envoyer une notification à tous les users de type service technique
            //On commence par récuperer tous les utilisateurs
            const users = await User.findAll({ where: { type: UserType.TECHNIQUE } });
            //On va envoyer une notification à chaque utilisateur
            users.forEach(async (user) => {
                await fetch("http://config-services:3007/config/postNotification", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        type: "info",
                        message: `Un developpeur vient de se connecter`,
                    }),
                }).catch(err => {
                    console.error("❌ Erreur lors de l'envoi de la notification :", err);
                });
            });
        }

    res.status(201).json({ message: `Connexion réussie`, user, token });
  } catch (err) {
    res.status(500).json({ error: `Erreur serveur : ${err}` });
  }
});

router.post('/create', async (req: any, res: any) => {
    const { name, email, password, type, extra } = req.body;
    try {
        const id = req.user.id;
        const user = await User.findOne({ where: { id } });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        const newUser = await addUser(res, { name, email, password, type, extra }, false, user.type as UserType);
        res.status(201).json({ message: "Utilisateur créé", newUser });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
});

router.get('/', async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    const allowedRoles = ['admin'];
    console.log(decoded)

    if (!allowedRoles.includes(decoded.type)) {
      return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
    }

    const users = await User.findAll();
    
    if (users.length === 0) return res.status(404).json({ error: 'Aucun utilisateur trouvé' });
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erreur serveur : ${err}` });
  }
});

// Routes avec paramètres (placées en dernier)
router.get('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erreur serveur : ${err}` });
  }
});

router.delete('/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { id } });    

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (user.type === UserType.RESTAURANT) {
      try {
              const response = await axios.post(BASE_URLS.RESTAURANT, {
                  ownerId: user.id,
              });
              return response.data;
          } catch (error) {
              console.error("Erreur lors de la supression du restaurant:", error);
              throw new Error("Impossible de supprimer le restaurant");
          }
    }

    await user.destroy()

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erreur serveur : ${err}` });
  }
});

router.put('/updatePassword', async (req: any, res: any) => {
    
    const { oldPassword, newPassword, confirmPassword, uuid } = req.body;

    // Récupération du token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Accès refusé : non identifié' });
    }

    try {
        // Décode le token pour vérifier les droits
        const decoded = jwt.verify(token, SECRET_KEY) as any;
        const allowedRoles = ['admin'];

        // Vérifie si l'utilisateur est admin ou si c'est son propre compte
        if (decoded.id !== uuid && !allowedRoles.includes(decoded.type)) {
            return res.status(403).json({ error: 'Accès refusé : privilèges insuffisants' });
        }

        // Vérifie que les nouveaux mots de passe correspondent
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Les nouveaux mots de passe ne correspondent pas' });
        }

        // Vérifie que l'utilisateur existe
        const user = await User.findOne({ where: { id: uuid } });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifie que l'ancien mot de passe est correct
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
        }

        // Hash le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Met à jour le mot de passe
        await user.update({ password: hashedPassword });

        return res.status(201).json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: `Erreur serveur : ${error.message}` });
        } else {
            return res.status(500).json({ error: 'Erreur serveur : erreur inconnue' });
        }
    }
});

export default router;

