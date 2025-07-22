"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

// Define the command with aliases "test" and "t"
zokou(
  { nomCom: ["test", "t"], reaction: "😌", nomFichier: __filename },
  async (dest, zk, commandeOptions) => {
    try {
      console.log("Command entered!!!"); // Log when command is triggered

      // Combined message: introduces both bot identities
      let z = 'Hello, I am *MARCEUSE-XMD😈* and *Zokou*, a WhatsApp multi-device bot.\n\n';
      let d = 'Developed by *Nicolaus Daniel😈* and *Djalega++*';
      let varmess = z + d;

      // Image URL (using the active code’s URL; replace if needed)
      let img = 'https://telegra.ph/file/9408d6f75ef62a0be6ae9.jpg';

      // Send message with image and caption
      if (!zk || !dest) {
        console.error("Error: zk or dest is undefined");
        return;
      }
      await zk.sendMessage(dest, { image: { url: img }, caption: varmess });
    } catch (error) {
      console.error("Failed to send message:", error);
      await zk.sendMessage(dest, { text: "Error: Could not send message. Please try again." });
    }
  }
);
console.log("my test"); // Debug log