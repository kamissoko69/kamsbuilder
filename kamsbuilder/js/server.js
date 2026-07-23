const express = require("express");
const fs = require("fs");
const archiver = require("archiver");
const fetch = require("node-fetch");
const OpenAI = require("openai");
const app = express();

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate", async (req, res) => {
  const { idea } = req.body;

  try {
    // Génération du code principal
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un générateur de sites web. Crée du HTML, CSS et JS basés sur l'idée donnée." },
        { role: "user", content: `Idée du site : ${idea}` }
      ]
    });

    const generatedCode = response.choices[0].message.content;

    // Génération du texte "À propos"
    const aboutResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Rédige un texte court et professionnel pour une section À propos." },
        { role: "user", content: `Sujet du site : ${idea}` }
      ]
    });
    const aboutText = aboutResponse.choices[0].message.content;

    // Génération du texte "Contact"
    const contactResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Rédige un texte court et professionnel pour une section Contact." },
        { role: "user", content: `Sujet du site : ${idea}` }
      ]
    });
    const contactText = contactResponse.choices[0].message.content;

    // Génération d'un logo IA
    const logoResponse = await client.images.generate({
      model: "gpt-image-1",
      prompt: `Logo futuriste premium pour un site basé sur l'idée : ${idea}`,
      size: "512x512"
    });
    const logoUrl = logoResponse.data[0].url;

    // Génération d'une illustration IA
    const illustrationResponse = await client.images.generate({
      model: "gpt-image-1",
      prompt: `Illustration futuriste bleu/violet pour un site basé sur l'idée : ${idea}`,
      size: "1024x1024"
    });
    const illustrationUrl = illustrationResponse.data[0].url;

    // Création de la structure demandée
    if (!fs.existsSync("kams-ebook")) fs.mkdirSync("kams-ebook");
    if (!fs.existsSync("kams-ebook/css")) fs.mkdirSync("kams-ebook/css");
    if (!fs.existsSync("kams-ebook/js")) fs.mkdirSync("kams-ebook/js");
    if (!fs.existsSync("kams-ebook/images")) fs.mkdirSync("kams-ebook/images");
    if (!fs.existsSync("kams-ebook/assets")) fs.mkdirSync("kams-ebook/assets");

    // Sauvegarde des fichiers
    const finalHtml = generatedCode
      .replace("Contenu généré par IA…", aboutText)
      .replace("Contenu généré par IA…", contactText);

    fs.writeFileSync("kams-ebook/index.html", finalHtml);
    fs.writeFileSync("kams-ebook/css/style.css", "body { background: #0a0a0a; color: white; }");
    fs.writeFileSync("kams-ebook/js/script.js", "console.log('Site généré par IA');");

    // Téléchargement du logo IA
    const logo = await fetch(logoUrl);
    const logoBuffer = await logo.arrayBuffer();
    fs.writeFileSync("kams-ebook/images/logo.png", Buffer.from(logoBuffer));

    // Téléchargement de l’illustration IA
    const illustration = await fetch(illustrationUrl);
    const illustrationBuffer = await illustration.arrayBuffer();
    fs.writeFileSync("kams-ebook/images/illustration.png", Buffer.from(illustrationBuffer));

    res.json({ success: true, message: "Projet généré avec contenu texte, logo et illustration IA." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la génération IA." });
  }
});

// Route pour télécharger le zip
app.get("/download", (req, res) => {
  const output = fs.createWriteStream("kams-ebook/assets/site.zip");
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    res.download("kams-ebook/assets/site.zip");
  });

  archive.pipe(output);
  archive.directory("kams-ebook/", false);
  archive.finalize();
});

app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
