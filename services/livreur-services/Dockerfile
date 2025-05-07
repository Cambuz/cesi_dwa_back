# Utiliser une image Node.js légère
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement package.json pour installer les dépendances
COPY package.json ./

# Installer les dépendances
RUN npm install

# Exposer le port
EXPOSE 3003

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]