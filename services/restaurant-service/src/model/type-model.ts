import { Table, Column, Model, DataType, BelongsToMany } from "sequelize-typescript";
import { Optional } from "sequelize";
import { Restaurant } from "./restaurant-model";
import { RestaurantType } from "./restaurantType-model";

export interface Type {
  id: string;
  name: string;
  icon: string;
}

export interface TypeAttributes extends Optional<Type, "id"> {}

@Table({ tableName: "types", timestamps: true })
export class Type extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  icon!: string;

  @BelongsToMany(() => Restaurant, () => RestaurantType)
  declare restaurants: Restaurant[];
}