const { zokou } = require("../framework/zokou");
const { ajouterUtilisateurAvecWarnCount, getWarnCountByJID, resetWarnCountByJID } = require("../bdd/warn");
const s = require("../set");

zokou(
  {
    nomCom: "warn",
    categorie: "Group",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, superUser, verifGroupe, verifAdmin, msgRepondu, auteurMsgRepondu } = commandeOptions;

    // Angalia ikiwa ni kikundi
    if (!verifGroupe) {
      return repondre("This is a group command.");
    }

    // Angalia ikiwa mtumiaji ni admin au superuser
    if (verifAdmin || superUser) {
      // Angalia ikiwa kuna ujumbe uliojibiwa
      if (!msgRepondu) {
        return repondre("Please reply to a user's message to warn them.");
      }

      // Shughulikia amri ya warn au reset
      if (!arg || !arg[0] || arg.join("") === "") {
        // Ongeza onyo kwa mshiriki
        await ajouterUtilisateurAvecWarnCount(auteurMsgRepondu);
        let warn = await getWarnCountByJID(auteurMsgRepondu);
        let warnLimit = s.WARN_COUNT;

        // Angalia ikiwa maonyo yamezidi kikomo
        if (warn >= warnLimit) {
          await repondre("This user has reached the warning limit and will be removed.");
          await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
        } else {
          let remaining = warnLimit - warn;
          repondre(`This user has been warned. Warnings remaining before removal: ${remaining}`);
        }
      } else if (arg[0] === "reset") {
        // Seti upya maonyo
        await resetWarnCountByJID(auteurMsgRepondu);
        repondre("Warn count has been reset for this user.");
      } else {
        repondre("Please reply to a user's message with .warn or .warn reset.");
      }
    } else {
      repondre("You are not an admin.");
    }
  }
);