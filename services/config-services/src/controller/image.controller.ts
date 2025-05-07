import { Request, Response } from 'express';
import Image from '../models/image.model';
import { v4 as uuidv4 } from 'uuid';

// Contrôleur pour le téléchargement de l'image
const imageController = {
    postImage: async (req: Request, res: Response): Promise<any> => {
        try {

            //On récupère le champ base64 de la requête
            const { base64 } = req.body;
            if (!base64) {
                return res.status(400).send({
                    message: "Aucune image fournie",
                });
            }
            //On génère un uuidv4
            const imageId = uuidv4();

            //On créé une nouvelle image à importer dans la base de données Mongo
            const newImage = new Image({
                imageId: imageId,
                base64: base64,
            });

            //On sauvegarde l'image dans la base de données
            await newImage.save();
            console.log("✅ Image sauvegardée avec succès");
            //On retourne l'imageId en réponse
            return res.status(200).send({
                message: "Image sauvegardée avec succès",
                imageId: imageId,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ Erreur lors de l'upload de l'image :", error.message);
                return res.status(500).send({
                    message: "Erreur lors de l'upload de l'image",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                return res.status(500).send({
                    message: "Erreur inconnue lors de l'upload de l'image",
                });
            }
        }
    },

    getImage: async (req: Request, res: Response): Promise<any> => {
        try {
            //On récupère le champ imageId de la requête
            const { imageId } = req.body;
            if (!imageId) {
                return res.status(400).send({
                    message: "Aucun imageId fourni",
                });
            }
            //On recherche l'image dans la base de données
            const image = await Image.findOne({ imageId: imageId });


            if (!image) {
                return res.status(404).send({
                    message: "Image non trouvée",
                });
            }



            //On retourne l'image en base64
            console.log("✅ Image récupérée avec succès");
            return res.status(200).send({
                message: "Image récupérée avec succès",
                image: image.base64,
            });


        } catch (error: unknown) {
            // Gestion des erreurs globales
            if (error instanceof Error) {
                console.error("❌ Erreur lors de la récupération de l'image :", error.message);
                return res.status(500).send({
                    message: "Erreur lors de la récupération de l'image",
                    error: error.message,
                });
            } else {
                console.error("❌ Erreur inconnue :", error);
                return res.status(500).send({
                    message: "Erreur inconnue lors de la récupération de l'image",
                });
            }
        }
    }

};

export default imageController;