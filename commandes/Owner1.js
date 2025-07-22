const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({ nomCom: "deployer", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    
    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg =  `> Hello *${nomAuteurMessage}*, you requested for my deployer 😌\n` +
                   `> *${s.OWNER_NAME}* is my charming, good-looking deployer 🍂💋.\n` +
                   `> Time: *${temps}*\n> Date: *${date}*\n\n` +
                   `> Powered by *𝗡𝗶𝗰𝗼𝗹𝗮𝘂𝘀 𝗗𝗮𝗻𝗶𝗲𝗹😈*`;

    const lien = mybotpic();

    try {
        if (lien.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(dest, {
                video: { url: lien },
                caption: infoMsg,
                footer: "Je suis *Best Coder MD*, développeur: 𝗡𝗶𝗰𝗼𝗹𝗮𝘂𝘀 𝗗𝗮𝗻𝗶𝗲𝗹😈",
                gifPlayback: true
            }, { quoted: ms });
        } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
            await zk.sendMessage(dest, {
                image: { url: lien },
                caption: infoMsg,
                footer: "Je suis *Best Coder MD*, développeur: 𝗡𝗶𝗰𝗼𝗹𝗮𝘂𝘀 𝗗𝗮𝗻𝗶𝗲𝗹😈"
            }, { quoted: ms });
        } else {
            repondre(infoMsg);
        }
    } catch (e) {
        console.error("🥵🥵 Deployer error:", e);
        repondre("🥵🥵 Deployer error: " + e);
    }
});
