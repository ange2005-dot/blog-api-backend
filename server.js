const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const swaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { checkAuth, checkRole } = require('./cleeroute');

const app = express();
app.use(express.json());

// Base de données
const db = new sqlite3.Database("blog.db");

// Creation table
db.run(`
CREATE TABLE IF NOT EXISTS articles(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT,
    contenu TEXT,
    auteur TEXT,
    categorie TEXT,
    date TEXT
)
`);

// Swagger config
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Blog Inf222 Taf1",
            version: "1.0.0",
            description: "Documentation API avec Swagger",
        },
        servers: [
            {
              url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./server.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

/**
 *  /:
 *   get:
 *     summary: Tester l API
 */
app.get("/", (req, res) => {
  res.send("API OK")
});

/**
 * @swagger
 *  /api/articles:
 *    get:
 *      summary: Récupérer tous les articles
 */
app.get("/api/articles", (req, res) => {
    db.all("SELECT * FROM articles", [], (err, rows) => {
        res.json(rows)
    })
});

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un article
 */
app.post("/api/articles", checkAuth, (req, res) => {
  
    const { titre, contenu, auteur, categorie, date } = req.body;
    db.run(
        "INSERT INTO articles(titre, contenu, auteur, categorie, date) VALUES (?, ?, ?, ?, ?)",
         [titre, contenu, auteur, categorie, date],
        function (err) {
            if (err) return res.send(err);
            res.json({ id: this.lastID });
        }
    )
});

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par ID
 */
app.get("/api/articles/:id", (req, res) => {
  
    db.get(
      "SELECT * FROM articles WHERE id=?", [req.params.id], (err, row) => {
        if (err) return res.send(err);
        
        if (!row) {
            return res.status(404).json({ message: "Article non trouvé" });
        }
        res.json(row);
    })
});

/**
 * DELETE (admin seulement)
 */
app.delete("/api/articles/:id", checkAuth, checkRole('admin'), (req, res) => {
    db.run("DELETE FROM articles WHERE id=?", [req.params.id], (err) => {
        res.json({ message: "Supprimé" })
    })
});

/**
 * PUT (auth requis)
 */
app.put("/api/articles/:id", checkAuth, (req, res) => {
    const { titre, contenu, auteur, categorie, date } = req.body;
    db.run(
        "UPDATE articles SET titre=?, contenu=?, auteur=?, categorie=?, date=? WHERE id=?",
        [titre, contenu, auteur, categorie, date, req.params.id],
        function (err) {
            if (err) return res.send(err);
            res.json({ message: "Article modifié" });
        }
    )   
});

app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000")
});