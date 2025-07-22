"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "repo",
    catégorie: "Général",
    reaction: "✨",
    nomFichier: __filename,
  },
  async (dest, zk, commandeOptions) => {
    const githubRepo = "https://api.github.com/repos/jokathanjoka/KINGSTON-XMD";
    const img = "https://telegra.ph/file/9408d6f75ef62a0be6ae9.jpg";

    try {
      const response = await fetch(githubRepo, {
        headers: {
          "User-Agent": "KINGSTON-XMD-Bot/1.0", // Added User-Agent for GitHub API compliance
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.html_url) {
        await zk.sendMessage(dest, {
          text: "Error: Could not fetch repository data. Please try again later.",
        });
        return;
      }

      const repoInfo = {
        stars: data.stargazers_count,
        forks: data.forks_count,
        lastUpdate: data.updated_at,
        owner: data.owner.login,
      };

      const releaseDate = new Date(data.created_at).toLocaleDateString("en-GB");
      const lastUpdateDate = new Date(data.updated_at).toLocaleDateString("en-GB");

      const gitdata = `HELLO WHATSAPP USER, WELCOME TO 𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈 SCRIPT 
This is *KINGSTON-MD*.\nGET SESSION ID *BY PAIRING CODE*: https://pairingcod-63465fd92ffa.herokuapp.com/pair/

🕷️ *REPOSITORY:* ${data.html_url}
🕷️ *STARS:* ${repoInfo.stars}
🕷️ *FORKS:* ${repoInfo.forks}
🕷️ *RELEASE DATE:* ${releaseDate}
🕷️ *UPDATE ON:* ${lastUpdateDate}  // Fixed to use formatted date
🕷️ *OWNER:* ${repoInfo.owner}     // Use dynamic owner instead of hardcoded "kingston"
__________________________________
       𝕡𝕠𝕨𝕖𝕣𝕖𝕕 𝕓𝕪 𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈`;

      await zk.sendMessage(dest, { image: { url: img }, caption: gitdata });
    } catch (error) {
      console.error("Error fetching data:", error);
      await zk.sendMessage(dest, {
        text: "An error occurred while fetching repository data. Please try again later.",
      });
    }
  }
);