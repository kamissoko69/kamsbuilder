import axios from "axios";


export async function generateWebsite(idea){


const prompt = `

Tu es Kam's AI Builder.

Crée un site web complet.

Projet :

${idea}


Tu dois retourner EXACTEMENT ce format :


---INDEX---

TON CODE HTML ICI


---STYLE---

TON CODE CSS ICI


---SCRIPT---

TON CODE JAVASCRIPT ICI


Ne mets aucune explication.

`;



const response = await axios.post(

"https://api.mistral.ai/v1/chat/completions",

{

model:"codestral-latest",

messages:[
{
role:"user",
content:prompt
}
],

temperature:0.2

},

{

headers:{

Authorization:
`Bearer ${process.env.MISTRAL_API_KEY}`,

"Content-Type":"application/json"

}

}

);



return response.data.choices[0].message.content;


}