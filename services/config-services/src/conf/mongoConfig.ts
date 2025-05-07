// conf/mongoConfig.ts
import mongoose from "mongoose";

export const initializeMongoDB = async () => {
    const mongoURI = "mongodb://root:example@mongo:27017/configdb?authSource=admin";

    console.log("Mongo URI: ", mongoURI);

    try {
        await mongoose.connect(mongoURI);
        console.log("✅ Connexion MongoDB réussie");
    } catch (err) {
        console.error("❌ Erreur de connexion à MongoDB :", err);
    }
};