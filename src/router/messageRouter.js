
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = new express.Router();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

// Création du client WhatsApp
const said = new Client({
    authStrategy: new LocalAuth({
        dataPath: "sessions",
        clientId: "said"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-gpu'],
    },
    webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html' }
});

// Route POST '/config'
router.post('/config', async (req, res) => {
    let instruction = req.body.instruction;
    if (instruction === "check") {
        said.initialize()
        const qr = await new Promise((resolve, reject) => {
            said.on("qr", (qr) => {
                resolve(qr);
            });
        });
        if(qr){
            res.send('disconnected')
        }
        said.on('authenticated', (session) => {
            console.log('WhatsApp client is connected');
            res.send('connected');
        });

        // Écouter l'événement 'disconnected' pour savoir quand le client WhatsApp est déconnecté
        said.on('disconnected', (reason) => {
            console.log('WhatsApp client is disconnected:', reason);
            res.send('disconnected');
        });
    }else if (instruction === "client init") {
        try {
             said.initialize();
            // Attendre que le code QR soit généré
            said.on("ready",()=>{
                console.log("client is ready")
                res.send("client is ready")
            });
            const qr = await new Promise((resolve, reject) => {
                said.on("qr", (qr) => {
                    resolve(qr);
                });
            });

            // Générer le code QR sous forme d'image
           
            const qrImageBuffer = await qrcode.toBuffer(qr, { errorCorrectionLevel: 'H' });

            // Enregistrer le code QR en tant qu'image JPEG
            const qrImagePath = path.join(__dirname, 'qr.jpg');
            fs.writeFileSync(qrImagePath, qrImageBuffer);

            // Envoyer le code QR dans la réponse HTTP
            res.sendFile(qrImagePath);
            said.on("ready",()=>{
                console.log("client is ready")
                res.send("client is ready")
            });

            

        } catch (error) {
            console.error("Error initializing WhatsApp client:", error);
            res.status(500).send("Error occurred during WhatsApp client initialization");
        }
    }
    if(instruction === "close"){
        try {
            said.destroy()
        } catch (error) {
            console.error("clos", error);
            res.status(500).send("Error occurred during clos");
        }                     
    }
    if (instruction === "send") {
        const numbers = req.body.phones;
        const message = req.body.message;
        const dely=req.body.dely
        let responseToSend = [];
        const sendMessageWithDelay = async (number, delay) => {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    let respons = {};
                    try {
                        number = number.substring(1) + "@c.us";
                        await said.sendMessage(number, message);
                        respons[`${number}`] = true;
                    } catch (error) {
                        respons[`${number}`] = false;
                        respons[`error${number}`] = error;
                    }
                    responseToSend.push(respons);
                    resolve();
                }, delay);
            });
        };
        const sendMessages = async () => {
            for (let i = 0; i < numbers.length; i++) {
                await sendMessageWithDelay(numbers[i], dely); 
            }
        };
        sendMessages().then(() => {
            res.send(responseToSend); 
        });
    }

});


module.exports = { router, said };















    // if (instruction === "send") {
    //     const numbers = req.body.phones;
    //     const message = req.body.message;
    //     let responseToSend = [];
    
    //     for (let number of numbers) {
    //         let respons = {};
    //         try {
    //             number = number.substring(1) + "@c.us"
    //             await said.sendMessage(number, message);
    //             respons[`${number}`] = true;
    //         } catch (error) {
    //             respons[`${number}`] = false;
    //             respons[`error${number}`] = error;
    //         }
    //         responseToSend.push(respons);
    //     }
    //     res.send(responseToSend);
    // }