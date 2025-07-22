const { zokou } = require('../framework/zokou');
const axios = require('axios');

zokou(
  { nomCom: 'quote', categorie: 'Group' },
  async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe, arg } = commandeOptions;

    if (!verifGroupe) {
      return repondre('❌ This command only works in groups!');
    }

    try {
      if (!arg[0]) {
        // Random quote
        const res = await axios.get('https://animechan.xyz/api/random');
        const quote = res.data;

        await repondre(`*𝗡𝗶𝗰𝗼𝗹𝗮𝘂𝘀-𝗠𝗗 Quotes*

🎬 Anime: ${quote.anime}
👤 Character: ${quote.character}
💬 Quote: ${quote.quote}

Powered by *Joel MD*`);
      } else {
        // Search by character
        const query = arg.join(' ');
        const res = await axios.get(`https://animechan.xyz/api/random/character?name=${encodeURIComponent(query)}`);
        const quote = res.data;

        await repondre(`𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈

🎬 Anime: ${quote.anime}
👤 Character: ${quote.character}
💬 Quote: ${quote.quote}

Powered by *Nicolaus Daniel 😈*`);
      }
    } catch (e) {
      await repondre('⚠️ Failed to fetch quote. Please try again.\nError: ' + e.message);
    }
  }
);
