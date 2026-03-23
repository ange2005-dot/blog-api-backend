# Blog API Backend

Une API REST pour gérer un blog avec Express.js et SQLite.

## Description

Ce projet est un backend pour une application blog complète. Il fournit des endpoints pour créer, lire, mettre à jour et supprimer des articles de blog.

## Technologies

- **Express.js** - Framework web Node.js
- **SQLite3** - Base de données SQL
- **Swagger/OpenAPI** - Documentation API interactive

## Installation

```bash
# Cloner le repository
git clone https://github.com/ange2005-dot/blog-api-backend.git
cd blog-api-backend

# Installer les dépendances
npm install

# Démarrer le serveur
node server.js
```

## Utilisation

Le serveur démarre sur `http://localhost:3000`

Documentation API disponible via Swagger UI à : `http://localhost:3000/api-docs`

## Architecture

- `server.js` - Point d'entrée principal et configuration du serveur
- `package.json` - Dépendances et scripts du projet
- `blog.db` - Base de données SQLite

## Auteur

Abatsong Ange Merveilles

## Licence

ISC
