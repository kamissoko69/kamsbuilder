import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import JSZip from "jszip";   // <-- Ajout de JSZip
import { generateWebsite } from "./generator.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("OPENROUTER_API_KEY chargé :", process.env.OPENROUTER_API_KEY ? "✅" : "❌");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Route classique JSON
app.post("/generate", async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ success: false, error: "Aucune idée reçue." });
    }

    const files = await generateWebsite(idea);
    res.json({ success: true, index: files.index, style: files.style, script: files.script });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Erreur pendant la génération IA." });
  }
});

// 🚀 Nouvelle route ZIP
app.post("/download-zip", async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ success: false, error: "Aucune idée reçue." });
    }

    // Génération des fichiers
    const files = await generateWebsite(idea);

    // Création du ZIP
    const zip = new JSZip();
    zip.file("index.html", files.index);
    zip.file("style.css", files.style);
    zip.file("script.js", files.script);

    const content = await zip.generateAsync({ type: "nodebuffer" });

    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", "attachment; filename=project.zip");
    res.send(content);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Erreur pendant la génération ZIP." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Kam's AI Builder lancé sur http://localhost:${PORT}`);
});
