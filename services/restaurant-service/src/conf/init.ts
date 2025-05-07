import { Type } from "../model/type-model";

export async function initializeTypes() {
  const defaultTypes = [
    { name: "Fast food", icon: "🍔" },
    { name: "Asiatique", icon: "🥢" },
    { name: "Desserts", icon: "🍰" },
    { name: "Petit déjeuner", icon: "🥐" },
    { name: "Pizza", icon: "🍕" },
    { name: "Sushi", icon: "🍱" },
    { name: "Burger", icon: "🍔" },
    { name: "Salades", icon: "🥗" },
    { name: "Végétarien", icon: "🥦" },
    { name: "Fruits de mer", icon: "🦐" },
    { name: "Kebab", icon: "🥙" },
    { name: "Tacos", icon: "🌮" },
    { name: "Pâtes", icon: "🍝" },
    { name: "Cuisine du monde", icon: "🌍" },
    { name: "Street Food", icon: "🌯" },
    { name: "Café", icon: "☕" }
  ];

  for (const type of defaultTypes) {
    await Type.findOrCreate({ 
      where: { name: type.name },
      defaults: type
    });
  }

  console.log("Types par défaut initialisés !");
}