import mongoose, { Schema, Document } from "mongoose";

export interface IMenu extends Document {
    uuid: string;
    uuid_restaurant: string;
}

export interface IArticle extends Document {
    uuid: string;
    uuid_restaurant: string;
}

export interface ILogCommand extends Document {
    uuid: string;
    uuid_client: string;
    uuid_livreur: string;
    uuid_restaurant: string;
    date: number;
    final_status: string;
    prixCart: string;
    prixTTC: string;
    articles: IArticle[];
    menus: IMenu[];
}

const logCommandSchema = new Schema<ILogCommand>({
    uuid: { type: String, required: true, unique: true },
    uuid_client: { type: String, required: true },
    uuid_livreur: { type: String, required: true },
    uuid_restaurant: { type: String, required: true },
    date: { type: Number, required: true },
    final_status: { type: String, required: true },
    prixCart: { type: String, required: true },
    prixTTC: { type: String, required: true },
    articles: [{ type: Object }],
    menus: [{ type: Object }],
});

const LogCommand = mongoose.model<ILogCommand>("logCommand", logCommandSchema);
export default LogCommand;
