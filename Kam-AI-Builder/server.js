import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

import fs from "fs-extra";
import archiver from "archiver";

import { generateWebsite } from "./generator.js";


dotenv.config();


const app = express();


const PORT = process.env.PORT || 3000;



// Configuration chemins

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);




// Middlewares

app.use(cors());

app.use(express.json());




// Servir le site frontend

app.use(express.static(
    path.join(__dirname,"public")
));





// Route génération IA

app.post("/generate", async (req,res)=>{


try{


const idea = req.body.idea;



if(!idea){

return res.status(400).json({

error:"Aucune idée reçue"

});

}




// Appel IA

const result = await generateWebsite(idea);





// dossier temporaire

const folder = path.join(
__dirname,
"generated",
"site"
);




await fs.remove(folder);

await fs.ensureDir(folder);






// Extraction du code IA


let html = 
result
.split("---STYLE---")[0]
.replace("---INDEX---","")
.trim();



let css =
result
.split("---STYLE---")[1]
.split("---SCRIPT---")[0]
.trim();



let js =
result
.split("---SCRIPT---")[1]
.trim();






// Création fichiers


await fs.writeFile(

`${folder}/index.html`,

html

);



await fs.writeFile(

`${folder}/style.css`,

css

);



await fs.writeFile(

`${folder}/script.js`,

js

);







// Création ZIP


const zipName="website.zip";


const zipPath =
path.join(
__dirname,
"generated",
zipName
);



const output =
fs.createWriteStream(zipPath);



const archive =
archiver("zip");



archive.pipe(output);



archive.directory(
folder,
false
);



await archive.finalize();





res.json({

success:true,

message:
"Site créé avec succès",

download:
"/download"

});





}

catch(error){


console.log(error);


res.status(500).json({

error:
"Erreur pendant la génération"

});


}



});







// Téléchargement ZIP


app.get("/download",(req,res)=>{


const file =
path.join(
__dirname,
"generated",
"website.zip"
);



res.download(file);



});







// Lancement serveur


app.listen(PORT,()=>{


console.log(
`Kam's AI Builder lancé sur ${PORT}`
);


});