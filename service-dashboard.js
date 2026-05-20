const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
        <h1>Dashboard Microservice</h1>
        <p>Données sensibles : ventes du mois = 12 345 €</p>
        <a href="/">Retour à l'accueil</a>
    `);
});

app.listen(3001, () => {
    console.log('📊 Dashboard service running on port 3001');
});