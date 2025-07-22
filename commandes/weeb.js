"use strict";
const axios = require("axios");
const fs = require("fs").promises; // Tumia fs.promises kwa urahisi
const { zokou } = require("../framework/zokou");

// Amri ya "waifu"
zokou(
  { nomCom: "waifu", categorie: "Weeb", reaction: "😏" },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    const url = "https://api.waifu.pics/sfw/waifu";
    try {
      const response = await axios.get(url);
      const imageUrl = response.data.url;
      await zk.sendMessage(origineMessage, { image: { url: imageUrl }, caption: "Here's your waifu!" }, { quoted: ms });
    } catch (error) {
      repondre(`Error fetching waifu image: ${error.message}`);
    }
  }
);

// Amri ya "neko"
zokou(
  { nomCom: "neko", categorie: "Weeb", reaction: "😺" },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    const url = "https://api.waifu.pics/sfw/neko";
    try {
      const response = await axios.get(url);
      const imageUrl = response.data.url;
      await zk.sendMessage(origineMessage, { image: { url: imageUrl }, caption: "Here's your neko!" }, { quoted: ms });
    } catch (error) {
      repondre(`Error fetching neko image: ${error.message}`);
    }
  }
);

// Amri ya "shinobu"
zokou(
  { nomCom: "shinobu", categorie: "Weeb", reaction: "🦋" },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    const url = "https://api.waifu.pics/sfw/shinobu";
    try {
      const response = await axios.get(url);
      const imageUrl = response.data.url;
      await zk.sendMessage(origineMessage, { image: { url: imageUrl }, caption: "Here's Shinobu!" }, { quoted: ms });
    } catch (error) {
      repondre(`Error fetching Shinobu image: ${error.message}`);
    }
  }
);

// Amri ya "megumin"
zokou(
  { nomCom: "megumin", categorie: "Weeb", reaction: "💥" },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    const url = "https://api.waifu.pics/sfw/megumin";
    try {
      const response = await axios.get(url);
      const imageUrl = response.data.url;
      await zk.sendMessage(origineMessage, { image: { url: imageUrl }, caption: "Here's Megumin!" }, { quoted: ms });
    } catch (error) {
      repondre(`Error fetching Megumin image: ${error.message}`);
    }
  }
);

// Amri ya "cosplay"
zokou(
  { nomCom: "cosplay", categorie: "Weeb", reaction: "😏" },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    const url = "https://fantox-cosplay-api.onrender.com/";
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const fileName = `./cosplay_${Date.now()}.jpg`; // Jina la kipekee la faili
      await fs.writeFile(fileName, response.data);
      await zk.sendMessage(origineMessage, { image: { url: fileName }, caption: "Here's a cosplay image!" }, { quoted: ms });
      await fs.unlink(fileName); // Ondoa faili baada ya kutuma
    } catch (error) {
      repondre(`Error fetching cosplay image: ${error.message}`);
    }
  }
);

// Amri ya "couplepp"
zokou(
  { nomCom: "couplepp", categorie: "Weeb", reaction: "💞" },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    const api = "https://smiling-hosiery-bear.cyclic.app/weeb/couplepp";
    try {
      repondre("They might not love you, but here's a cute couple! 😜");
      const result = await axios.get(api);
      await zk.sendMessage(dest, { image: { url: result.data.male }, caption: "For Man" }, { quoted: ms });
      await zk.sendMessage(dest, { image: { url: result.data.female }, caption: "For Woman" }, { quoted: ms });
    } catch (error) {
      repondre(`Error fetching couple images: ${error.message}`);
    }
  }
);