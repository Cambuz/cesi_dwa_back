import { Table, Column, Model, DataType, BelongsToMany } from "sequelize-typescript";
import { Optional } from "sequelize";
import { Article } from "./article-model";
import { MenuArticle } from "./menu-article";

export interface Menu {
  id: string;
  nom: string;
  prix: number;
  restaurantId: string;
  ownerId: string;
  logo: string | null;
}

export interface MenuAttributes extends Optional<Menu, "id"> {}

@Table({ tableName: "menus", timestamps: true })
export class Menu extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  nom!: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  prix!: number;

  @Column({ type: DataType.UUID, allowNull: false })
  restaurantId!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  ownerId!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  logo!: string | null;

  @BelongsToMany(() => Article, () => MenuArticle)
  declare articles: Article[];
} 