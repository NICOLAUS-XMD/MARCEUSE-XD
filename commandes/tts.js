"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleTTS = require("google-tts-api");
const { zokou } = require("../framework/zokou");

// Command: dit (French TTS)
zokou(
  { nomCom: "dit", categorie: "tts", reaction: "👄" },
  async (dest, zk, commandeOptions) => {
    try {
      const { ms, arg, repondre } = commandeOptions;
      // Check if input text is provided
      if (!arg[0]) {
        repondre("Insert a word");
        return;
      }
      const mots = arg.join(" "); // Join input words into a single string
      // Generate audio URL for French
      const url = googleTTS.getAudioUrl(mots, {
        lang: "fr",
        slow: false,
        host: "https://translate.google.com",
      });
      console.log("Audio URL (French):", url);
      // Send audio message to WhatsApp
      await zk.sendMessage(dest, { audio: { url: url }, mimetype: "audio/mp4" }, { quoted: ms, ptt: true });
    } catch (error) {
      console.error("Error in dit command:", error);
      await zk.sendMessage(dest, { text: "Error: Could not generate or send audio. Please try again." });
    }
  }
);

// Command: itta (Japanese TTS)
zokou(
  { nomCom: "itta", categorie: "tts", reaction: "👄" },
  async (dest, zk, commandeOptions) => {
    try {
      const { ms, arg, repondre } = commandeOptions;
      if (!arg[0]) {
        repondre "Insert a word");
        return;
      }
      const mots = arg.join(" ");
      // Generate audio URL for Japanese
      const url = googleTTS.getAudioUrl(mots, {
        lang: "ja",
        slow: false,
        host: "https://translate.google.com",
      });
      console.log("Audio URL (Japanese):", url);
      await zk.sendMessage(dest, { audio: { url: url }, mimetype: "audio/mp4" }, { quoted: ms, ptt: true });
    } catch (error) {
      console.error("Error in itta command:", error);
      await zk.sendMessage(dest, { text: "Error: Could not generate or send audio. Please try again." });
    }
  }
);

// Command: say (English TTS)
zokou(
  { nomCom: "say", categorie: "tts", reaction: "👄" },
  async (dest, zk, commandeOptions) => {
    try {
      const { ms, arg, repondre } = commandeOptions;
      // Check if input text is provided
      if (!arg[0]) {
        repondre("Insert a word");
        return;
      }
      const mots = arg.join(" "); // Join input words into a single string
      // Generate audio URL for English
      const url = googleTTS.getAudioUrl(mots, {
        lang: "en",
        slow: false,
        host: "https://translate.google.com",
      });
      console.log("Audio URL (English):", url);
      // Send audio message to WhatsApp
      await zk.sendMessage(dest, { audio: { url: url }, mimetype: "audio/mp4" }, { quoted: ms, ptt: true });
    } catch (error) {
      console.error("Error in say command:", error);
      await zk.sendMessage(dest, { text: "Error: Could not generate or send audio. Please try again." });
    }
  }
);