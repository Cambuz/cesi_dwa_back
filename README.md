# CESI-DWA-BACK
CESI Dépôt projet DWA - Back  
Le projet n'est pas disponible en production. Certaines fonctionnalités ne sont donc pas parfaitement optimisées pour un environnement de production, comme par exemple l'absence de load-balancing ou la gestion des images. Nous aurions pu utiliser un cloud comme Google ou AWS, ou bien une application dédiée comme Kubernetes, afin de gérer la répartition de la charge, l'instanciation de multiples services et la redirection vers chacun d'eux, comme détaillé sur le schéma d'architecture du projet.  
Nous passons par le framework Node.js pour chacun de nos services et par Nginx pour la gestion du proxy et la conteneurisation de nos différents services.


## Installation
Après avoir pull le projet sur un répertoire en local, il vous faudra installer make à la racine de votre projet
- npm install make
  
Ensuite, vous devez créer un fichier ".env" à la racine de votre projet afin d'y ajouter les variables d'environnement. Ce fichier n'est pas disponible sur ce dépôt et devra vous être transmis directement par un membre de l'équipe de développement.

Enfin, vous pourrez lancer la commande pour initialiser et lancer votre projet.

## Liste des commandes
- **docker-compose up** (initialise / lance toutes les images docker du projet)
- **docker-compose down** (éteins toutes les images Docker du projet)
- **docker system prune -af --volumes** (réinitialise l'ensemble des conteneurs du projet)

## Procédures de dépannages
**Réinitialiser les conteneurs**:
- docker-compose down
- docker system prune -af --volumes
- docker-compose up  

**Réinitialisation de la base de données**:
En cas de soucis avec la base de données, connectez-vous à l'adminer:  
- url: http://localhost:8080/
- Système : PostegreSQL
- Serveur : db
- Utilisateur : postgres
- Mot de passe : password  
Au moment de la connexion à la base de données, choisir la base nommée "postgres". Supprimez alors toutes les tables et lancez les commandes de down, de prune et de up pour bien tout relancer proprement.
Si une ou plusieurs tables refusent de se supprimer (c'est généralement le cas de la table restaurants ou de la table articles), exécutez les requêtes SQL suivantes:
- DROP TABLE restaurants CASCADE
- DROP TABLE articles CASCADE

**Installation des dépendances**:
En cas d'erreurs liées à vos dépendances, réinitialisez vos conteneurs. Si cela vous arrive pendant le développement d'un nouveau service, pensez à bien agrémenter vos fichiers package.json et package-lock.json avec vos dépendances dans les "dependencies" et "dev-dependencies" en ajoutant bien le décorateur "@types/" avant le nom de votre dépendance, afin qu'au premier démarrage du conteneur, toutes vos dépendances soient correctement initialisées. Enfin, réinitialisez vos conteneurs. N'oubliez pas d'ajouter vos fichiers package.JSON et package-lock.json à votre commit afin que le problème ne se répercute pas sur les autres contributeurs du projet.

## Utilisation de l'API
En local, l'API s'appelle via **http://localhost/**

## Utilisation de l'API & description du fonctionnement des différents services.
La documentation des API de chaque service est disponible dans son Swagger dédié. Pour accéder aux Swaggers, il faut avoir lancé le projet.  
**articles-services**:
- Route d'utilisation : http://localhost/articles/
- Port : 3004
- Swagger : http://localhost:3004/swagger
> Description : Gestion des menus et des articles.
  
**auth-service**:
- Route d'utilisation : http://localhost/auth/
- Port : 3006
> Description : Gestion du système d'authentification.

**client-services**:
- Route d'utilisation : http://localhost/client/
- Port : 3002
- Swagger : http://localhost:3002/swagger
> Description : Gestion des utilisateurs de type client.

**commande-services**:
- Route d'utilisation : http://localhost/client/
- Port : 3005
- Swagger : http://localhost:3005/swagger
> Description : Gestion des commandes.

**config-services**:
- Route d'utilisation : http://localhost/config/
- Port : 3007
- Swagger : http://localhost:3007/swagger
> Description : Gestion des paramètres, des notifications, des logs, des images et des calculs de distance et de prix.

**livreur-services**:
- Route d'utilisation : http://localhost/livreur/
- Port : 3003
- Swagger : http://localhost:3003/swagger
> Description : Gestion des utilisateurs de type livreur.

**restaurant-services**:
- Route d'utilisation : http://localhost/restaurants/
- Port : 3001
- Swagger : http://localhost:3001/swagger
> Description : Gestion des utilisateurs de type restaurant.

**user-services**:
- Route d'utilisation : http://localhost/users/
- Port : 3000
- Swagger : http://localhost:3000/swagger
> Description : Gestion des utilisateurs et de l'authentification (login/register).  

**Autres**:
Nous gérons également les services MongoDB, PostgreSQL et Adminer.
  
  
  
  
