import { Request, Response } from "express";
import {unlink} from "fs";
import paramsController from "./params.controller.ts";

const configController = {
    callGetDistance: async (req: Request, res: Response) => {
        try {
            const address1: string = req.body.address1;
            const address2: string = req.body.address2;

            if (!address1 || !address2) {
                res.status(400).send("Erreur : une ou plusieurs adresses invalides.");
                return;
            }

            const { distanceRoute } = await configController.getDistance(address1, address2);

            res.status(200).send({
                message: "Données extraites avec succès",
                address1,
                address2,
                distanceRoute,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send("Erreur serveur : " + error.message);
            } else {
                res.status(500).send("Erreur serveur : erreur inconnue");
            }
        }
    },


    //Calculer la distance entre deux adresses
    getDistance: async (address1: String, address2: String) => {
        try {
            if (!address1 || !address2) {
                throw new Error("Une ou plusieurs adresses invalides.");
            }

            //On remplace les " " par des "+" dans les deux addresses
            const address1url = address1.replace(/ /g, "+");
            const address2url = address2.replace(/ /g, "+");

            const url1 : string = `https://nominatim.openstreetmap.org/search?q=${address1url}&format=json&polygon_kml=1&addressdetails=1`;
            const url2 : string = `https://nominatim.openstreetmap.org/search?q=${address2url}&format=json&polygon_kml=1&addressdetails=1`;

            const [response1, response2] = await Promise.all([fetch(url1), fetch(url2)]);

            if (!response1.ok || !response2.ok) {
                throw new Error("Impossible de récupérer les coordonnées GPS des adresses.");
            }

            const data1 = await response1.json();
            const data2 = await response2.json();

            if (!Array.isArray(data1) || data1.length === 0 || !Array.isArray(data2) || data2.length === 0) {
                throw new Error("Aucune coordonnée GPS trouvée pour l'une des adresses.");
            }

            const firstResult1 = data1[0];
            const firstResult2 = data2[0];


            const lat1 = parseFloat(firstResult1.lat);
            const lon1 = parseFloat(firstResult1.lon);

            const lat2 = parseFloat(firstResult2.lat);
            const lon2 = parseFloat(firstResult2.lon);

            //On contrôle qu'on à bien récupéré les coordonnées
            if (!lat1 || !lon1 || !lat2 || !lon2) {
                throw new Error("Impossible de récupérer les coordonnées GPS des adresses.");
            }
            console.log(lat1, lon1, lat2, lon2); // Debugging: Afficher les coordonnées GPS récupérées


            const routingUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false&geometries=polyline`;
            const routingResponse = await fetch(routingUrl);

            if (!routingResponse.ok) {
                throw new Error("Erreur lors de la récupération de la distance via OpenStreetMap.");
            }

            const routingData = await routingResponse.json();
            const route = routingData.routes?.[0];

            if (!route) {
                throw new Error("Aucune route trouvée entre les deux points.");
            }

            const distanceRoute = route.distance / 1000; // Distance en km
            const roundedDistanceRoute = Math.round(distanceRoute * 100) / 100;

            return {
                distanceRoute: roundedDistanceRoute,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("Erreur inconnue lors du calcul de la distance.");
            }
        }
    },
    //Fonction permettant de calculer le prix d'une commande
    getCommandPrice: async (req: Request, res: Response) => {
        try {
            const address1: String = req.body.address1;
            const address2: String = req.body.address2;
            const cartValue: number = req.body.cartValue;

            if (!address1 || !address2) {
                res.status(400).send("Erreur : une ou plusieurs adresses invalides.");
                return;
            }

            if(!cartValue || typeof cartValue !== "number") {
                res.status(400).send("Erreur : la valeur du panier est invalide.");
                return;
            }

            // Appel local à la fonction `getDistance` pour obtenir la distance entre address1 et address2
            const { distanceRoute: distanceTotal } = await configController.getDistance(address1, address2);

            //On va maintenant récuperer les paramètres dont nous avons besoins
            const deliveryPriceByKm = await paramsController.getParam("deliveryPriceByKm");
            const servicePrice = await paramsController.getParam("servicePrice");

            //On va récuperer uniquement le value
            const numDeliveryPriceByKm = deliveryPriceByKm?.value ?? 0;
            const numServicePrice = servicePrice?.value ?? 0;

            //Maintenant, nous allons opérer les calculs
            const tvaService : number = 0.2;
            const tvaFood : number = 0.1;

            const cartTTC : number =  Math.round((cartValue * (1 + tvaFood)) * 100) / 100;
            const serviceTTC : number =  Math.round((numServicePrice * (1 + tvaService)) * 100) / 100;

            const roundedDeliveryHT : number = Math.round((numDeliveryPriceByKm * distanceTotal) * 100) / 100;
            const roundedDeliveryTTC : number = Math.round((roundedDeliveryHT * (1 + tvaService)) * 100) / 100;

            res.status(200).send({
                cart: {
                    "Cart HT": cartValue,
                    "Cart TVA": tvaFood * 100 + "%",
                    "Cart TTC": cartTTC,
                },
                service: {
                    "Service HT": numServicePrice,
                    "Service TVA": tvaService * 100 + "%",
                    "Service TTC": serviceTTC,
                },
                delivery: {
                    "Unit price / km": numDeliveryPriceByKm,
                    "Distance total": distanceTotal,
                    "Delivery HT": roundedDeliveryHT,
                    "Delivery TVA": tvaService * 100 + "%",
                    "Delivery TTC": roundedDeliveryTTC
                },
                total: {
                    "Total HT": cartValue+numServicePrice+roundedDeliveryHT,
                    "Total TTC": cartTTC+serviceTTC+roundedDeliveryTTC,
                }
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send("Erreur serveur : " + error.message);
            } else {
                res.status(500).send("Erreur serveur : erreur inconnue");
            }
        }
    },
};

export default configController;