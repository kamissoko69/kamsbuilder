const button = document.querySelector(".generate-btn");
const ideaInput = document.querySelector("#idea");
const statusBox = document.querySelector("#status");


button.addEventListener("click", async () => {


    const idea = ideaInput.value.trim();


    if (!idea) {

        statusBox.innerHTML =
        "⚠️ Décris ton projet avant de générer.";

        return;

    }



    button.disabled = true;

    button.innerHTML =
    "⚡ Création en cours...";



    statusBox.innerHTML = `

    <div class="loading">

    <p>🤖 Analyse de ton idée...</p>

    <p>⌛ Création de la structure du site...</p>

    <p>🎨 Génération du design...</p>

    <p>💻 Génération HTML CSS JavaScript...</p>

    <p>🚀 Préparation du téléchargement...</p>

    </div>

    `;



    try {


        const response = await fetch("/generate", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                idea: idea

            })


        });



        const data = await response.json();



        if(data.success){


            statusBox.innerHTML = `

            <div class="success">

            <h3>
            ✅ Ton site est prêt !
            </h3>


            <p>
            Kam's AI Builder a créé ton projet.
            </p>


            <a href="${data.download}" 
            class="download-btn">

            📦 Télécharger mon site

            </a>


            </div>

            `;


        }

        else{


            statusBox.innerHTML =
            "❌ Une erreur est arrivée.";

        }



    }


    catch(error){


        console.log(error);


        statusBox.innerHTML = `

        ❌ Impossible de contacter le serveur IA.

        `;


    }



    button.disabled = false;


    button.innerHTML =
    "⚡ Générer mon site";


});