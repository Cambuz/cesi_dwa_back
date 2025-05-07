import { Table, Column, Model, DataType, BelongsToMany } from "sequelize-typescript";
import { Optional } from "sequelize";
import { Menu } from "./menu-model";
import { MenuArticle } from "./menu-article";

export interface Article {
  id: string;
  nom: string;
  description: string;
  prix: number;
  type: string;
  restaurantId: string;
  ownerId: string;
  logo: string | null;
}

export interface ArticleAttributes extends Optional<Article, "id"> {}

@Table({ tableName: "articles", timestamps: true })
export class Article extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  nom!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  prix!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  type!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  restaurantId!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  ownerId!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  logo!: string | null;

  // Relation avec la table de liaison
  @BelongsToMany(() => Menu, () => MenuArticle)
  declare menus: Menu[];
}