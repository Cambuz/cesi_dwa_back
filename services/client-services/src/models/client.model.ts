import { Optional } from "sequelize";
import { Table, Column, DataType, Model } from "sequelize-typescript";

export interface ClientAttributes {
  userId: string;
  address: string;
  codePostal: string;
  phone: string;
}

export interface ClientCreationAttributes extends Optional<ClientAttributes, "userId"> {}

@Table({ tableName: "clients", timestamps: true })
export class Client extends Model<ClientAttributes, ClientCreationAttributes> {
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  codePostal!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone!: string;
}