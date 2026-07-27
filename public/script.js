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
    console.log("➡️ Envoi de l'idée au serveur :", idea);

    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea })
    });

    const data = await response.json();
    console.log("⬅️ Réponse serveur :", data);

    if (data.success && data.code) {
      statusBox.innerHTML = `
        <div class="success">
          <h3>✅ Ton site est prêt !</h3>
          <p>Kam's AI Builder a généré ton projet.</p>
          <pre style="background:#111;color:#0f0;padding:1em;overflow:auto;max-height:400px;">
${data.code}
          </pre>
        </div>
      `;
    } else {
      statusBox.innerHTML = "❌ Une erreur est arrivée (aucun code reçu).";
    }
  } catch (error) {
    console.error("Erreur côté client :", error);
    statusBox.innerHTML = "❌ Impossible de contacter le serveur IA.";
  }

  button.disabled = false;
  button.innerHTML = "⚡ Générer mon site";
});
