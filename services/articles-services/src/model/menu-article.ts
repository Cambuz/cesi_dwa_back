import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import { Menu } from "./menu-model";
import { Article } from "./article-model";

@Table({ tableName: "menu_articles", timestamps: false })
export class MenuArticle extends Model {
  @ForeignKey(() => Menu)
  @Column({ type: DataType.UUID, allowNull: false })
  menuId!: string;

  @ForeignKey(() => Article)
  @Column({ type: DataType.UUID, allowNull: false })
  articleId!: string;
} 