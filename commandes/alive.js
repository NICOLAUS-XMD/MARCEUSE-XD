const { zokou} = require('../framework/zokou');
const { addOrUpdateDataInAlive, getDataFromAlive} = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou(
  {
    nomCom: 'alive',
    categorie: 'General'
},
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, superUser} = commandeOptions;

    const data = await getDataFromAlive();

    if (!arg ||!arg[0] || arg.join('') === '') {
      if (data) {
        const { message, lien} = data;

        const mode = s.MODE.toLowerCase() === "yes"? "public": "private";

        // Tumia time zone ya Tanzania 🇹🇿
        moment.tz.setDefault("Africa/Dar_es_Salaam");
        const temps = moment().format("HH:mm:ss");
        const date = moment().format("DD/MM/YYYY");

        const alivemsg = `
*Owner*: ${s.OWNER_NAME}
*Mode*: ${mode}
*Date*: ${date}
*Hours (Tanzania)*: ${temps}

${message}

*JOEL-MD-WABOT*`;

        if (lien.match(/\.(mp4|gif)$/i)) {
          try {
            zk.sendMessage(dest, { video: { url: lien}, caption: alivemsg}, { quoted: ms});
} catch (e) {
            console.log("🥵🥵 Menu erreur " + e);
            repondre("🥵🥵 Menu erreur " + e);
}
} else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
          try {
            zk.sendMessage(dest, { image: { url: lien}, caption: alivemsg}, { quoted: ms});
} catch (e) {
            console.log("🥵🥵 Menu erreur " + e);
            repondre("🥵🥵 Menu erreur " + e);
}
} else {
          repondre(alivemsg);
}
} else {
        if (!superUser) {
          repondre("𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗 😈");
          return;
}
        await repondre("𝕡𝕠𝕨𝕖𝕣𝕖𝕕 𝕓𝕪 𝗡𝗶𝗰𝗼𝗹𝗮𝘂𝘀 𝗗𝗮𝗻𝗶𝗲𝗹 😈");
        repondre("𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗 😈");
}
} else {
      if (!superUser) {
        repondre("𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗 😈");
        return;
}

      const texte = arg.join(' ').split(';')[0];
      const tlien = arg.join(' ').split(';')[1] || "";

      await addOrUpdateDataInAlive(texte, tlien);
      repondre("join Joel MD channel 🇹🇿: https://whatsapp.com/channel/0029Vb4B338E50Uk2hA7r21U");
}
}
);