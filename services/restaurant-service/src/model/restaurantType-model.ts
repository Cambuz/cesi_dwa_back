import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import { Restaurant } from "./restaurant-model";
import { Type } from "./type-model";

@Table({ tableName: "restaurant_types", timestamps: false })
export class RestaurantType extends Model {
  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.UUID, allowNull: false })
  restaurantId!: string;

  @ForeignKey(() => Type)
  @Column({ type: DataType.UUID, allowNull: false })
  typeId!: string;
}