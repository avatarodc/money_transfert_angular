const express = require('express');
const cors = require('cors');
const app = express();

// Configuration CORS complète
const corsOptions = {
  origin: ['http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Appliquer CORS avant toutes les autres middlewares
app.use(cors(corsOptions));

// Parser pour JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route de test
app.get('/api/test', (req, res) => {
  console.log('Route de test appelée');
  res.json({ message: 'API connectée avec succès' });
});

// Vos routes d'authentification
app.post('/api/auth/login', (req, res) => {
  console.log('Tentative de connexion reçue:', req.body);
  // Votre logique de login ici
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} - http://localhost:${PORT}`);
});
