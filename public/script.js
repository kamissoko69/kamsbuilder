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
          <p>Les fichiers ont été générés dans le dossier <b>output/</b>.</p>

          <button id="downloadAllBtn" class="download-btn">📦 Télécharger tout le projet</button>
          <button id="previewBtn" class="preview-btn">👀 Voir un aperçu</button>

          <div id="previewBox" style="margin-top:20px; border:1px solid #444; height:400px; overflow:auto;">
            <p style="text-align:center;">Clique sur "Voir un aperçu" pour afficher ton site ici.</p>
          </div>
        </div>
      `;

      // 🚀 Bouton pour télécharger tout le projet en ZIP
      const downloadAllBtn = document.querySelector("#downloadAllBtn");
      downloadAllBtn.addEventListener("click", () => {
        window.location.href = "/download-all";
      });

      // 👀 Bouton pour afficher l’aperçu
      const previewBtn = document.querySelector("#previewBtn");
      previewBtn.addEventListener("click", () => {
        const previewBox = document.querySelector("#previewBox");
        previewBox.innerHTML = `
          <iframe src="/preview/index.html" style="width:100%; height:100%; border:none;"></iframe>
        `;
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
