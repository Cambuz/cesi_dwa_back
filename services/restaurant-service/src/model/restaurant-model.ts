import { Table, Column, Model, DataType, BelongsToMany } from "sequelize-typescript";
import { Optional } from "sequelize";
import { Type } from "./type-model";
import { RestaurantType } from "./restaurantType-model"

export interface Restaurant {
  id: string;
  ownerId: string;
  logo: string | null;
  restaurantName: string;
  address: string;
  siret: string;
  codePostal: string;
}

export interface RestaurantAttributes extends Optional<Restaurant, "id"> {}

@Table({ tableName: "restaurants", timestamps: true })
export class Restaurant extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.UUID, allowNull: false })
  ownerId!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  logo!: string | null;

  @Column({ type: DataType.STRING, allowNull: false })
  restaurantName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  siret!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  codePostal!: string;

  // Relation avec la table de liaison
  @BelongsToMany(() => Type, () => RestaurantType)
  declare types: Type[];
}