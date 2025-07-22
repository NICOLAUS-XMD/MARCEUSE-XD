"use strict";
const { zokou } = require("../framework/zokou"); // Inaleta Zokou framework
const moment = require("moment-timezone"); // Inaleta moment-timezone (haijatumiwa katika msimbo huu)
const { getBuffer } = require("../framework/dl/Function"); // Inaleta getBuffer kwa kupakua picha
const { default: axios } = require("axios"); // Inaleta axios kwa HTTP requests

// Function ya kubadilisha sekunde kuwa umbizo rahisi (siku, saa, dakika, sekunde)
const runtime = function (seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

// Amri ya uptime
zokou(
  {
    nomCom: "uptime",
    desc: "To check runtime",
    Categorie: "General",
    reaction: "⚙️",
    fromMe: "true",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    try {
      if (!repondre) throw new Error("repondre function is undefined");
      await repondre(`*_Uptime of Kingstone MD Bot is: ${runtime(process.uptime())}_*`);
    } catch (error) {
      console.error("Uptime error:", error);
      await zk.sendMessage(dest, { text: "Error fetching uptime. Please try again." });
    }
  }
);

// Amri ya screenshot (ss)
zokou(
  {
    nomCom: "ss",
    desc: "Screenshots website",
    Categorie: "General",
    reaction: "🎥",
    fromMe: "true",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    try {
      if (!repondre) throw new Error("repondre function is undefined");
      if (!arg || arg.length === 0) return repondre("Please provide a valid URL.");

      const linkk = arg.join(" ");
      // Thibitisha URL ni halali
      if (!linkk.match(/^https?:\/\/.+/)) {
        return repondre("Invalid URL. Please provide a valid website link (e.g., https://example.com).");
      }

      const linkkk = `https://api.screenshotmachine.com/?key=c04d3a&url=${encodeURIComponent(linkk)}&dimension=720x720`;
      const res = await getBuffer(linkkk);

      if (!res) throw new Error("Failed to fetch screenshot");
      await zk.sendMessage(
        dest,
        { image: res, caption: "𝑾𝒆𝒃 𝑺𝒄𝒓𝒆𝒆𝒏𝒔𝒉𝒐𝒕 𝒃𝒚 *MARCEUSE-XMD😈*" },
        { quoted: ms }
      );
    } catch (error) {
      console.error("Screenshot error:", error);
      await zk.sendMessage(dest, { text: `Error taking screenshot: ${error.message}` });
    }
  }
);