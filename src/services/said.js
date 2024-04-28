// const {Client, LocalAuth}=require('whatsapp-web.js');
// const qrcode= require('qrcode-terminal');
// const said= new Client({
//     authStrategy: new LocalAuth({
//         dataPath: "sessions",
//         clientId: "said"
//     }),
//     puppeteer: {
//         headless: false,
//         args: [ '--no-sandbox', '--disable-gpu', ],
//     },
//     webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', }
// })
// said.on("qr",(qr)=>qrcode.generate(qr,{small:true}))
// said.on("ready",()=>{
//     console.log("client is ready")
// })
// said.on("message",async(msg)=>{
//     try{
//         if(msg.from !='status@broadcast'){
//             const contact=await msg.getContact()
//             console.log(contact,msg.body)
//         }
//     }catch(error){
//         console.log(error)
//     }
// })
// module.exports= said