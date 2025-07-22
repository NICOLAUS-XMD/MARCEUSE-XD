"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reagir = reagir;

/**
 * Sends a reaction (emoji) to a message in a chat.
 * @param {string} dest - The destination chat ID.
 * @param {Object} zok - The zokou client instance.
 * @param {Object} msg - The message object containing the key to react to.
 * @param {string} emoji - The emoji to send as a reaction.
 * @returns {Promise<boolean>} True if the reaction was sent successfully, false otherwise.
 * @throws {Error} If inputs are invalid or the reaction fails.
 */
async function reagir(dest, zok, msg, emoji) {
  try {
    // Validate inputs
    if (!dest || typeof dest !== "string") {
      throw new Error("Invalid destination chat ID");
    }
    if (!zok || typeof zok.sendMessage !== "function") {
      throw new Error("Invalid zokou client instance");
    }
    if (!msg || !msg.key) {
      throw new Error("Invalid message object or missing key");
    }
    if (!emoji || typeof emoji !== "string" || emoji.trim() === "") {
      throw new Error("Invalid or empty emoji");
    }

    // Send the reaction
    await zok.sendMessage(dest, { react: { text: emoji.trim(), key: msg.key } });
    return true;
  } catch (error) {
    console.error("Error sending reaction:", error);
    throw new Error(`Failed to send reaction: ${error.message}`);
  }
}

exports.reagir = reagir;