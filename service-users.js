const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
        <h1>Users Microservice</h1>
        <ul>
            <li>Admin (admin@example.com)</li>
            <li>User1 (user1@example.com)</li>
            <li>User2 (user2@example.com)</li>
        </ul>
        <a href="/">Retour à l'accueil</a>
    `);
});

app.listen(3002, () => {
    console.log('👥 Users service running on port 3002');
});