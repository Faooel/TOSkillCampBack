require('dotenv').config(); // Charger les variables d'environnement

// server.js
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000; // Utilisez la variable PORT du fichier .env

// Autoriser les requêtes cross-origin (CORS)
app.use(cors());

// Configuration de la connexion à la base de données en utilisant les variables d'environnement
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Connexion à la base de données
client.connect()
    .then(() => console.log('Connecté à la base de données PostgreSQL'))
    .catch(err => console.error('Erreur lors de la connexion à la base de données', err));

// Route pour obtenir les données des matchs
app.get('/api/matches', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM matches ORDER BY game_creation DESC LIMIT 50');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des données des matchs', error);
        res.status(500).send('Erreur lors de la récupération des données des matchs');
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
