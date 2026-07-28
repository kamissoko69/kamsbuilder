const button = document.querySelector(".generate-btn");
const ideaInput = document.querySelector("#idea");
const statusBox = document.querySelector("#status");

button.addEventListener("click", async () => {
  const idea = ideaInput.value.trim();

  if (!idea) {
    statusBox.innerHTML = "⚠️ Décris ton projet avant de générer.";
    return;
  }

  button.disabled = true;
  button.innerHTML = "⚡ Création en cours...";

  statusBox.innerHTML = `
    <div class="loading">
      <p>🤖 Analyse de ton idée...</p>
      <p>⌛ Création de la structure du site...</p>
      <p>🎨 Génération du design...</p>
      <p>💻 Génération HTML CSS JavaScript...</p>
      <p>🚀 Préparation du rendu...</p>
    </div>
  `;

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea })
    });

    const data = await response.json();

    if (data.success) {
      statusBox.innerHTML = `
        <div class="success">
          <h3>✅ Ton site est prêt !</h3>
          <p>Kam's AI Builder a généré ton projet.</p>

          <h4>index.html</h4>
          <pre style="background:#111;color:#0f0;padding:1em;overflow:auto;max-height:300px;">
${data.index || "⚠️ Aucun contenu reçu pour index.html"}
          </pre>

          <h4>style.css</h4>
          <pre style="background:#111;color:#0f0;padding:1em;overflow:auto;max-height:300px;">
${data.style || "⚠️ Aucun contenu reçu pour style.css"}
          </pre>

          <h4>script.js</h4>
          <pre style="background:#111;color:#0f0;padding:1em;overflow:auto;max-height:300px;">
${data.script || "⚠️ Aucun contenu reçu pour script.js"}
          </pre>

          <button id="downloadBtn" class="download-btn">📦 Télécharger mon site</button>
        </div>
      `;

      // Ajout du téléchargement automatique en ZIP
      const downloadBtn = document.querySelector("#downloadBtn");
      downloadBtn.addEventListener("click", () => {
        const zipContent = {
          "index.html": data.index,
          "style.css": data.style,
          "script.js": data.script
        };

        const blob = new Blob([JSON.stringify(zipContent, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "site.json"; // tu peux remplacer par un vrai ZIP plus tard
        a.click();

        URL.revokeObjectURL(url);
      });
    } else {
      statusBox.innerHTML = "❌ Une erreur est arrivée.";
    }
  } catch (error) {
    console.error(error);
    statusBox.innerHTML = "❌ Impossible de contacter le serveur IA.";
  }

  button.disabled = false;
  button.innerHTML = "⚡ Générer mon site";
});
