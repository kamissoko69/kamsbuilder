import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

import { generateWebsite } from "./generator.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vérification de la clé API
console.log("OPENROUTER_API_KEY chargé :", process.env.OPENROUTER_API_KEY ? "✅" : "❌");

// Middlewares
app.use(cors());
app.use(express.json());

// Servir le frontend
app.use(express.static(path.join(__dirname, "public")));

// Génération IA
app.post("/generate", async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({
        success: false,
        error: "Aucune idée reçue."
      });
    }

    console.log("========== NOUVELLE DEMANDE ==========");
    console.log(idea);

    // Ici, generateWebsite retourne { index, style, script }
    const files = await generateWebsite(idea);

    console.log("========== RÉPONSE IA ==========");
    console.log(files);
    console.log("================================");

    res.json({
      success: true,
      index: files.index,
      style: files.style,
      script: files.script
    });

  } catch (error) {
    console.error("===== ERREUR BACKEND =====");
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Erreur pendant la génération IA."
    });
  }
});

// Route principale
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Kam's AI Builder lancé sur http://localhost:${PORT}`);
});
