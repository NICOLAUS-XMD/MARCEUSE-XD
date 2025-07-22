const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({ nomCom: "𝗻𝗶𝗰𝗼", categorie: "Menu" }, async (dest, zk, commandeOptions) => {

    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework//zokou");

    var coms = {};
    var mode = "public";

    if ((s.MODE).toLowerCase() !== "yes") {
        mode = "private";
    }

    // Group commands by category
    cm.map(async (com) => {
        if (!coms[com.categorie]) {
            coms[com.categorie] = [];
        }
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault(s.TZ);

    // Get current time and date in specified timezone
    const currentTime = moment().format('HH:mm:ss');
    const currentDate = moment().format('DD/MM/YYYY');

    // Header info message
    let infoMsg = `
┏━━ MARCEUSE-XMD😈 NEW BOT ━━┓
┃   Mode: ${mode}
┃   User: ${s.OWNER_NAME}
┃
┣━𒈒 MARCEUSE-XMD😈 new version 𒈒━➠
┗━━━𒈒 by Nicolaus Daniel 😈 𒈒━━┛\n\n`;

    // Build the menu list
    let menuMsg = `
┏━━━━━━━━━━━━━━┓
┣❏ MARCEUSE-XMD bot
┣❏ © Nicolaus _🕷️
┗━━━━━━━━━━━━━━┛\n\n

𒈒 MARCEUSE-XMD😈 cmds 𒈒
`;

    for (const cat in coms) {
        menuMsg += `┏━━━━━⚼ ${cat}`;
        for (const cmd of coms[cat]) {
            menuMsg += `\n┃➠ ${cmd}`;
        }
        menuMsg += `\n┗━━━━━━━━━━━━━━┛\n`;
    }

    menuMsg += `
┏━━━━━━━━━━━━━━━━┓
┣❏ MARCEUSE-XMD😈 bot
┣❏ © by Nicolaus Daniel
┗━━━━━━━━━━━━━━━━┛\n

┏━━━━━━━━━━━━━━┓
┃ Powered by Nicolaus
┗━━━━━━━━━━━━━━┛\n
`;

    let link = mybotpic();

    // Check if link is a video/gif
    if (link.match(/\.(mp4|gif)$/i)) {
        try {
            await zk.sendMessage(dest, {
                video: { url: link },
                caption: infoMsg + menuMsg,
                footer: "I am *MARCEUSE-XMD😈*, developer Nicolaus Daniel",
                gifPlayback: true
            }, { quoted: ms });
        } catch (e) {
            console.log("🥵🥵 Menu error " + e);
            repondre("🥵🥵 Menu error " + e);
        }
    }
    // Check if link is an image
    else if (link.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            await zk.sendMessage(dest, {
                image: { url: link },
                caption: infoMsg + menuMsg,
                footer: "I am *TKM-bot*, developer Cod3uchiha"
            }, { quoted: ms });
        } catch (e) {
            console.log("🥵🥵 Menu error " + e);
            repondre("🥵🥵 Menu error " + e);
        }
    } else {
        // If no media, just send text menu
        repondre(infoMsg + menuMsg);
    }
});
