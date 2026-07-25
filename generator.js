import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function generateWebsite(idea) {

    const prompt = `
Tu es Kam's AI Builder.

Tu es un développeur web expert.

Crée un site web complet.

Retourne UNIQUEMENT :

---INDEX---
(le code HTML)

---STYLE---
(le code CSS)

---SCRIPT---
(le code JavaScript)

Aucune explication.
`;

    try {

        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {

                model: "cohere/north-mini-code:free",

                messages: [

                    {
                        role: "system",
                        content: prompt
                    },

                    {
                        role: "user",
                        content: idea
                    }

                ],

                temperature: 0.6

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

        return response.data.choices[0].message.content;

    }

    catch(err){

        console.log(err.response?.data || err.message);

        throw err;

    }

}
