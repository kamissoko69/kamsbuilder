import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function generateWebsite(idea) {
  const prompt = `
Tu es Kam's AI Builder.
Tu es un développeur Front-End senior.
Ta mission est de créer un site web professionnel à partir de la demande de l'utilisateur.

Projet :
${idea}

Le site doit être :
- Moderne
- Responsive
- Professionnel
- Élégant
- HTML5 valide
- CSS moderne
- JavaScript séparé
- Compatible mobile

Tu dois retourner UNIQUEMENT ce format :

---INDEX---
(le contenu complet de index.html)

---STYLE---
(le contenu complet de style.css)

---SCRIPT---
(le contenu complet de script.js)

Ne donne aucune explication.
Ne mets pas de balises Markdown.
Ne mets pas \`\`\`html, \`\`\`css ou \`\`\`javascript.
Retourne uniquement les trois sections.
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "cohere/north-mini-code:free",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: idea }
        ],
        temperature: 0.6,
        max_tokens: 12000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://kamsbuilder.onrender.com",
          "X-Title": "Kam's AI Builder"
        }
      }
    );

    console.log("========== RAW RESPONSE ==========");
    console.log(response.data);

    const choice = response.data.choices?.[0] || {};
    const rawText =
      choice.message?.content ||
      choice.delta?.content ||
      response.data.output_text ||
      "";

    // Découpage en sections
    const indexMatch = rawText.match(/---INDEX---([\s\S]*?)---STYLE---/);
    const styleMatch = rawText.match(/---STYLE---([\s\S]*?)---SCRIPT---/);
    const scriptMatch = rawText.match(/---SCRIPT---([\s\S]*)/);

    return {
      index: indexMatch ? indexMatch[1].trim() : "",
      style: styleMatch ? styleMatch[1].trim() : "",
      script: scriptMatch ? scriptMatch[1].trim() : ""
    };
  } catch (err) {
    console.error("===== ERREUR OPENROUTER =====");
    console.error(err.response?.data || err.message);
    throw err;
  }
}
