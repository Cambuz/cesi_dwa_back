import { Optional } from "sequelize";
import { Table, Column, DataType, Model } from "sequelize-typescript";
import {Col} from "sequelize/types/utils";

export interface CommandeAttributes {
    id: string;
    clientId: string;
    restaurantId: string;
    livreurId: string | null;
    status: "Pending" | "Accepted" | "In Delivery" | "Completed" | "Cancelled";
    cartPriceHT: number;
    finalDeliveryTTC: number | null;
    finalPriceTTC: number | null;
    addressClient: string;
    addressRestaurant: string;
    menus: Array<{
        uuid: string;
        uuid_restaurant: string;
        amount: number;
    }>;
    articles: Array<{
        uuid: string;
        uuid_restaurant: string;
        amount: number;
    }>;
}

export interface CommandeCreationAttributes extends Optional<CommandeAttributes, "id"> {} // Seul id est optionnel

@Table({ tableName: "commandes", timestamps: true })
export class Commande extends Model<CommandeAttributes, CommandeCreationAttributes> {
    @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    declare id: string;

    @Column({ type: DataType.UUID, allowNull: false })
    clientId!: string;

    @Column({ type: DataType.UUID, allowNull: false })
    restaurantId!: string;

    @Column({ type: DataType.UUID, allowNull: true })
    livreurId!: string | null;

    @Column({
        type: DataType.ENUM("Pending", "Accepted", "In Delivery", "Completed", "Cancelled"),
        allowNull: false
    })
    status!: "Pending" | "Accepted" | "In Delivery" | "Completed" | "Cancelled";

    @Column({ type: DataType.DECIMAL, allowNull: false })
    cartPriceHT!: number;

    @Column({ type: DataType.DECIMAL, allowNull: true })
    finalDeliveryTTC!: number | null;

    @Column({ type: DataType.DECIMAL, allowNull: true })
    finalPriceTTC!: number | null;

    @Column({ type: DataType.STRING, allowNull: false })
    addressClient!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    addressRestaurant!: string;

    @Column({ type: DataType.JSONB, allowNull: true })
    menus!: Array<{
        uuid: string;
        uuid_restaurant: string;
        amount: number;
    }>;

    @Column({ type: DataType.JSONB, allowNull: true })
    articles!: Array<{
        uuid: string;
        uuid_restaurant: string;
        amount: number;
    }>;
}
