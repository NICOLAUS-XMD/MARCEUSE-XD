const { zokou } = require("../framework/zokou");
const conf = require("../set");
const { jidDecode } = require("@whiskeysockets/baileys");

zokou({
  nomCom: "profile",
  categorie: "Fun",
}, async (dest, zk, commandeOptions) => {
  const {
    ms,
    repondre,
    auteurMessage,
    nomAuteurMessage,
    msgRepondu,
    auteurMsgRepondu
  } = commandeOptions;

  let jid, nom, ppUrl, mess;

  if (!msgRepondu) {
    jid = auteurMessage;
    nom = nomAuteurMessage;

    try {
      ppUrl = await zk.profilePictureUrl(jid, "image");
    } catch {
      ppUrl = conf.IMAGE_MENU;
    }

    const status = await zk.fetchStatus(jid);

    mess = {
      image: { url: ppUrl },
      caption: `*Nom :* ${nom}\n*Status :*\n${status.status}`
    };

  } else {
    jid = auteurMsgRepondu;
    nom = "@" + auteurMsgRepondu.split("@")[0];

    try {
      ppUrl = await zk.profilePictureUrl(jid, "image");
    } catch {
      ppUrl = conf.IMAGE_MENU;
    }

    const status = await zk.fetchStatus(jid);

    mess = {
      image: { url: ppUrl },
      caption: `*Nom :* ${nom}\n*Status :*\n${status.status}`,
      mentions: [auteurMsgRepondu]
    };
  }

  await zk.sendMessage(dest, mess, { quoted: ms });
});
