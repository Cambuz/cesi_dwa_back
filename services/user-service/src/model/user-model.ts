import { Table, Column, Model, DataType } from "sequelize-typescript";
import { Optional } from "sequelize";
import { UserType } from "./user-type";

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  banned: boolean;
  type: UserType;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({ tableName: "users", timestamps: true })
export class User extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.ENUM(UserType.CLIENT, UserType.RESTAURANT, UserType.LIVREUR, UserType.DEVELOPPEUR, UserType.COMMERCIAL, UserType.TECHNIQUE, UserType.ADMIN), allowNull: false })
  type!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.DECIMAL, allowNull: false, defaultValue: 0 })
  balance!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  banned!: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;
}