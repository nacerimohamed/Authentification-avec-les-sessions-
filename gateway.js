const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session (stockage en mémoire, à remplacer par Redis en production)
app.use(session({
    secret: 'monSecretSession',
    resave: false,
    saveUninitialized: false,
}));

// Middleware d'authentification pour les routes protégées
function requireAuth(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('Non authentifié. <a href="/login">Se connecter</a>');
}

// Page d'accueil
app.get('/', (req, res) => {
    if (req.session.user) {
        res.send(`
            <h1>Bienvenue ${req.session.user}</h1>
            <a href="/dashboard">Dashboard</a><br>
            <a href="/users">Liste users</a><br>
            <a href="/logout">Déconnexion</a>
        `);
    } else {
        res.send(`
            <h1>Accueil</h1>
            <a href="/login">Connexion</a>
        `);
    }
});

// Formulaire de connexion
app.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Nom utilisateur" required />
            <input type="password" name="password" placeholder="Mot de passe" required />
            <button type="submit">Connexion</button>
        </form>
    `);
});

// Traitement du login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        req.session.user = username;
        res.redirect('/');
    } else {
        res.send('Identifiants incorrects. <a href="/login">Réessayer</a>');
    }
});

// Déconnexion
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('Déconnecté avec succès. <a href="/">Accueil</a>');
    });
});

// Proxy vers le microservice dashboard (protégé)
app.use('/dashboard', requireAuth, createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
}));

// Proxy vers le microservice users (protégé)
app.use('/users', requireAuth, createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
}));

// Lancement de la gateway
app.listen(3000, () => {
    console.log('✅ API Gateway démarrée sur http://localhost:3000');
});