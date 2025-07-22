const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");

zokou({
  nomCom: 'ping',
  desc: 'To check ping',
  categorie: 'General',
  reaction: '🍑',
  fromMe: 'true',
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;

  const start = new Date().getTime();

  // Simulate async action (optional)
  await new Promise(res => setTimeout(res, 10)); // optional small delay

  const end = new Date().getTime();
  const ping = end - start;

  return repondre(`*Pong!*\n\`\`\`${ping} ms\`\`\``);
});
