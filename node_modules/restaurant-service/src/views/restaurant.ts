import express from "express";
import { Restaurant } from "../model/restaurant-model";
import { Type } from "../model/type-model";

const router = express.Router();

router.get('/types', async (req: any, res: any) => {
  try {
    const types = await Type.findAll();

    if (types.length === 0) return res.status(404).json({ error: 'Aucun restaurant trouvé' });
    
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erreur serveur : ${err}` });
  }
});

router.get('/', async (req: any, res: any) => {
  try {
    const restaurants = await Restaurant.findAll();
    
    if (restaurants.length === 0) return res.status(404).json({ error: 'Aucun restaurant trouvé' });
    
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erreur serveur : ${err}` });
  }
});

router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({ where: { ownerId: id } });
    
    if (!restaurant) return res.status(404).json({ error: 'Restaurant non trouvé' });
    
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erreur serveur : ${err}` });
  }
});

export default router;