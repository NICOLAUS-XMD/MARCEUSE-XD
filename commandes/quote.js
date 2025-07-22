const { zokou } = require('../framework/zokou');
const fetch = require('node-fetch');

zokou({ nomCom: 'quote', categorie: 'Fun' }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, arg } = commandeOptions;

  if (!verifGroupe) {
    return repondre('❌ This command is only available in groups.');
  }

  try {
    let quote;

    if (!arg[0]) {
      const res = await fetch('https://animechan.xyz/api/random');
      quote = await res.json();
    } else {
      const query = encodeURIComponent(arg.join(' '));
      const res = await fetch(`https://animechan.xyz/api/random/character?name=${query}`);
      quote = await res.json();
    }

    if (!quote || quote.error) {
      return repondre('❌ No quote found. Try another character.');
    }

    const msg = `╔════════════════════╗
║   𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈 BOT     
╚════════════════════╝

🎬 *Anime:* ${quote.anime}
👤 *Character:* ${quote.character}
💬 *Quote:* ${quote.quote}

🌀 *Powered by MARCEUSE-XMD😈*`;

    repondre(msg);
  } catch (e) {
    console.error(e);
    repondre('🥵 Error fetching quote: ' + e.message);
  }
});
