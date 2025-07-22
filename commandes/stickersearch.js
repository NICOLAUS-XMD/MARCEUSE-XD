"use strict";
const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { zokou } = require("../framework/zokou");

zokou(
  {
    commandName: "stickersearch", // Changed from nomCom
    category: "Search", // Changed from categorie
    reaction: "🍁",
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms, arg, nomAuteurMessage } = commandeOptions;

    if (!arg || !arg.join(" ").trim()) {
      await repondre("Please provide a search query!");
      return;
    }

    const gifSearchTerm = arg.join(" ");
    const tenorApiKey = process.env.TENOR_API_KEY || "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c"; // Use environment variable
    const clientKey = "my_project";
    const limit = 5; // Reduced to 5 since we only need 5 stickers

    try {
      const response = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(gifSearchTerm)}&key=${tenorApiKey}&client_key=${clientKey}&limit=${limit}&media_filter=gif`
      );

      const results = response.data.results;

      if (!results || results.length === 0) {
        await repondre("No GIFs found for your search query.");
        return;
      }

      for (let i = 0; i < Math.min(results.length, limit); i++) {
        const gifUrl = results[i]?.media_formats?.gif?.url;
        if (!gifUrl) {
          console.warn(`Skipping invalid GIF at index ${i}`);
          continue;
        }

        const packname = nomAuteurMessage || "Sticker Pack"; // Fallback if nomAuteurMessage is undefined
        const sticker = new Sticker(gifUrl, {
          pack: packname,
          author: "𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫MD",
          type: StickerTypes.FULL,
          categories: ["🤩", "🎉"],
          id: `sticker_${Date.now()}_${i}`, // Unique ID for each sticker
          quality: 60,
          background: "transparent",
        });

        const stickerBuffer = await sticker.toBuffer();
        await zk.sendMessage(dest, { sticker: stickerBuffer }, { quoted: ms || undefined });
      }

      if (results.length === 0) {
        await repondre("No valid GIFs could be converted to stickers.");
      }
    } catch (error) {
      console.error("Error during sticker search:", error.message);
      await repondre("An error occurred while searching for stickers. Please try again later.");
    }
  }
);