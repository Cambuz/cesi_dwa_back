import bcrypt from "bcrypt";
import axios from "axios";
import { User } from "../model/user-model";
import { v4 as uuidv4 } from "uuid";
import { UserType } from "../model/user-type";
import { BASE_URLS } from "../conf/route";
import jwt from "jsonwebtoken";


interface UserConfig {
    name: string;
    email: string;
    password: string;
    type: string;
    extra?: Record<string, any>;
    authToken?: string;
}

async function createClient(userId: string) {
    try {
        const response = await axios.post(BASE_URLS.CLIENT, { userId });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du client:", error);
        throw new Error("Impossible de créer le client");
    }
}

async function createLivreur(userId: string, extra: any, authToken: string | undefined) {

    if (!authToken) {
        throw new Error("Token d'authentification requis pour créer un livreur");
    }

    try {
        const livreurData = {
            userId: userId,
            phone: extra.phone ?? "Numéro de téléphone à définir",
            vehicule: extra.vehicule ?? "Véhicule à définir",
            gpsLongitude: extra.gpsLongitude ?? 0,
            gpsLatitude: extra.gpsLatitude ?? 0
        };

        const response = await axios.post(BASE_URLS.LIVREUR, livreurData, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        return {
            id: response.data.id,
            name: response.data.phone,
            vehicule: response.data.vehicule,
            gpsLongitude: response.data.gpsLongitude,
            gpsLatitude: response.data.gpsLatitude
        };
    } catch (error) {
        console.error("Erreur lors de la création du livreur:", error);
        throw new Error("Impossible de créer le livreur");
    }
}

async function createRestaurant(userId: string, extra: any, authToken: string | undefined) {
    if (!authToken) {
        throw new Error("Token d'authentification requis pour créer un restaurant");
    }

    try {
        const restaurantData = {
            ownerId: userId,
            name: extra.name ?? `${extra.name}'s Restaurant`,
            address: extra.address ?? "Adresse à définir",
            siret: extra.siret ?? "SIRET à définir",
            logo: extra.logo ?? null,
            types: extra.types ?? []
        };

        const response = await axios.post(BASE_URLS.RESTAURANT, restaurantData, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Retourner uniquement les données nécessaires
        return {
            id: response.data.id,
            name: response.data.name,
            address: response.data.address,
            siret: response.data.siret,
            logo: response.data.logo
        };
    } catch (error: any) {
        console.error("Erreur lors de la création du restaurant:", error.message);
        throw new Error(`Impossible de créer le restaurant: ${error.message}`);
    }
}

const typeFactory: Record<string, (userId: string, extra?: any, authToken?: string) => Promise<any>> = {
    [UserType.CLIENT]: createClient,
    [UserType.LIVREUR]: createLivreur,
    [UserType.RESTAURANT]: createRestaurant
};

export async function addUser(res: any, userConfig: UserConfig, isNew: boolean = false, userType: UserType = UserType.CLIENT): Promise<{ user: User; token: string }> {
    try {
        const hashedPassword = await bcrypt.hash(userConfig.password, 10);
        const userId = uuidv4();

        const user = await User.create({
            id: userId,
            name: userConfig.name,
            email: userConfig.email,
            password: hashedPassword,
            type: userType
        });

        // Créer le token après la création de l'utilisateur
        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type
        }, process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY", { expiresIn: '4h' });

        if (isNew) {
            switch (userType) {
                case UserType.CLIENT:
                    await createClient(userId);
                    break;
                case UserType.LIVREUR:
                    await createLivreur(userId, userConfig.extra, token);
                    break;
                case UserType.RESTAURANT:
                    await createRestaurant(userId, userConfig.extra, token);
                    break;
            }
        }

        return { user, token };
    } catch (error: any) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        throw error;
    }
}