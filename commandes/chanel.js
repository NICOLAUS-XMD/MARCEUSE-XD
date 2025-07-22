"use strict";
Object.defineProperty(exports, "__esModule", { value: true});
const { zokou} = require("../framework/zokou");

// First command: Share channel link
zokou({ commandName: "channel", reaction: "😈", fileName: __filename}, async (destination, zk, commandOptions) => {
    console.log("Command received!");

    const intro = 'Hi, my name is *MARCEUSE-XMD😈*\n\nI am a WhatsApp multi-device bot, here is the channel';
    const dev = ' developed by *Nicolaus_Dan🕸️🕷️*';
    const message = `${intro} ${dev}`;

    const link = 'https://whatsapp.com/channel/0029Vb4B338E50Uk2hA7r21U';
    await zk.sendMessage(destination, { text: `${message}\n${link}`});
});

// Second command: Send image with bot intro
module.exports.command = () => {
    const commandNames = ["test", "t"];
    const reaction = "☺️";
    return { commandNames, execute, reaction};
};

async function execute(messageOrigin, zok) {
    console.log("Command received!");

    const intro = 'Hi, my name is *Nicolaus😈*\n\nI am a WhatsApp multi-device bot';
    const dev = ' developed by *Nicolaus Daniel 😈 & Aliy Abdarazul 😈*';
    const fullMessage = `${intro} ${dev}`;

    const imageUrl = 'https://telegra.ph/file/7113ddc85a26a69a7a437.jpg';
    await zok.sendMessage(messageOrigin, {
        image: { url: imageUrl},
        caption: fullMessage
});
}