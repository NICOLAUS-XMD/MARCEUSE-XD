const { zokou } = require("../framework/zokou");
const YT = require("./YT"); // From your third submission
const { reagir } = require("./reagir"); // From your fourth submission
const { uploadImageToImgur } = require("./imgur"); // This module
const fs = require("fs");
const path = require("path");
const { fetchBuffer } = require("./Function"); // From your second submission

// Credits from JSON
const credits = {
  author: "HACKING955 (Aliy Abdarazul😈)",
  regards: "Encrypted by Nicolaus Daniel😈",
};

// Imgur Client ID (replace with your actual Client ID)
const IMGUR_CLIENT_ID = "your-imgur-client-id"; // TODO: Replace with your Imgur Client ID

// YouTube Search Command
zokou(
  { nomCom: "yts", categorie: "Search", reaction: "🔍" },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    const query = arg.join(" ");

    try {
      // Send reaction
      await reagir(dest, zk, ms, "🔍");

      if (!query) {
        repondre("Please provide a search query.");
        return;
      }

      const videos = await YT.search(query);
      if (!videos.length) {
        repondre("No videos found for your query.");
        return;
      }

      // Download the first video's thumbnail
      const thumbnailUrl = videos[0].image;
      const thumbnailPath = path.join(__dirname, "dustbin", `thumb_${Date.now()}.jpg`);
      const thumbnailBuffer = await fetchBuffer(thumbnailUrl);
      fs.writeFileSync(thumbnailPath, thumbnailBuffer);

      // Upload thumbnail to Imgur
      const imgurUrl = await uploadImageToImgur(thumbnailPath, IMGUR_CLIENT_ID);

      // Clean up temporary thumbnail file
      fs.unlink(thumbnailPath, (err) => {
        if (err) console.error("Error deleting temp thumbnail:", err);
      });

      let captions = "=== YouTube Search Results ===\n";
      for (let i = 0; i < Math.min(videos.length, 15); i++) {
        captions += `${i + 1}. Title: ${videos[i].title}\nDuration: ${videos[i].duration.label}\nURL: ${videos[i].url}\n\n`;
      }
      captions += `=== Reply with the number to download ===\nThumbnail: ${imgurUrl}\nCredits: ${credits.author} - ${credits.regards}`;

      await zk.sendMessage(dest, { text: captions }, { quoted: ms });
    } catch (error) {
      console.error("Error in YouTube search:", error);
      repondre("Error searching YouTube: " + error.message);
    }
  }
);