import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import archiver from "archiver"; // 📦 pour créer un ZIP
import { generateWebsite } from "./generator.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 📂 Dossier où on écrit les fichiers générés
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Route pour générer et sauvegarder les fichiers
app.post("/generate", async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ success: false, error: "Aucune idée reçue." });
    }

    const files = await generateWebsite(idea);

    // Écriture des fichiers dans le dossier output/
    fs.writeFileSync(path.join(outputDir, "index.html"), files.index);
    fs.writeFileSync(path.join(outputDir, "style.css"), files.style);
    fs.writeFileSync(path.join(outputDir, "script.js"), files.script);

    res.json({ success: true, message: "Fichiers générés dans le dossier output/" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Erreur pendant la génération." });
  }
});

// 🚀 Route pour télécharger tout le projet en ZIP
app.get("/download-all", (req, res) => {
  const zipName = "project.zip";
  res.setHeader("Content-Disposition", `attachment; filename=${zipName}`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip");
  archive.pipe(res);
  archive.directory(outputDir, false); // ajoute tout le dossier output/
  archive.finalize();
});

// 👀 Route pour prévisualiser les fichiers directement
app.use("/preview", express.static(outputDir));

// Servir le frontend (public/)
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`🚀 Kam's AI Builder lancé sur http://localhost:${PORT}`);
  console.log(`📂 Fichiers disponibles sur http://localhost:${PORT}/download-all`);
  console.log(`👀 Aperçu disponible sur http://localhost:${PORT}/preview/index.html`);
});
