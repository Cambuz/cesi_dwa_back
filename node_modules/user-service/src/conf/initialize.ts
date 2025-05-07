  import { User } from '../model/user-model';
  import { UserType } from '../model/user-type';
  import { sequelize } from './dbConfig';
  import { v4 as uuidv4 } from 'uuid';
  import bcrypt from "bcrypt";
  
export const createAdminIfNotExists = async () => {
  try {
    await sequelize.authenticate();

    const existingAdmin = await User.findOne({ where: { type: UserType.ADMIN } });
    const password = await bcrypt.hash('admin123', 10)

    if (!existingAdmin) {
      await User.create({
        id: uuidv4(),
        name: 'Admin',
        email: 'admin@example.com',
        password: password,
        type: UserType.ADMIN,
      });
        console.log("✅ Compte admin créé avec succès");
      } else {
        console.log("✅ L'admin existe déjà.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la création du compte admin:", error);
  }
};

