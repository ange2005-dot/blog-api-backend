const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const swaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

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
app.use("/api-docs", swaggerUI.serve,swaggerUI.setup(specs));

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
 *      responses:
 *         200:
 *          description: Liste des articles
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                    titre:
 *                      type: string
 *                    contenu:
 *                      type: string
 *                    auteur:
 *                      type: string
 *                    categorie:
 *                      type: string
 *                    date:
 *                      type: string
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                  type: string
 *               auteur:
 *                  type: string
 *               categorie:
 *                  type: string
 *               date:
 *                  type: string
 *     responses:
 *       200:
 *         description: Article créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 */
app.post("/api/articles", (req, res) => {
  
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titre:
 *                   type: string
 *                 contenu:
 *                   type: string
 *                 auteur:
 *                   type: string
 *                 categorie:
 *                   type: string
 *                 date:
 *                   type: string
 *       404:
 *         description: Article non trouvé
 *   put:
 *     summary: Modifier un article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               auteur:
 *                 type: string
 *               categorie:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article modifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *   delete:
 *     summary: Supprimer un article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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

app.delete("/api/articles/:id", (req, res) => {
    db.run("DELETE FROM articles WHERE id=?", [req.params.id], (err) => {
        res.json({ message: "Supprimé" })
    })
});

app.put("/api/articles/:id", (req, res) => {
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