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

          <h4>📂 Téléchargements directs :</h4>
          <ul>
            <li><a href="/download/index.html" target="_blank">index.html</a></li>
            <li><a href="/download/style.css" target="_blank">style.css</a></li>
            <li><a href="/download/script.js" target="_blank">script.js</a></li>
          </ul>
        </div>
      `;
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
