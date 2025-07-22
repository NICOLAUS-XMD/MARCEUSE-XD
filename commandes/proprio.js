const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");

zokou({
  nomCom: "reboot",
  categorie: "Mods",
  reaction: "👨🏿‍💼"
}, async (dest, z, commandeOptions) => {
  const { repondre, ms, superUser } = commandeOptions;

  if (!superUser) {
    return repondre("❌ *Access Denied:* This command is for *owner only*.");
  }

  repondre("♻️ *Restarting bot via PM2...*");

  exec("pm2 restart all", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Restart failed: ${error.message}`);
      return repondre(`❌ Failed to restart:\n\`\`\`${error.message}\`\`\``);
    }
    if (stderr) {
      console.warn(`⚠️ stderr: ${stderr}`);
    }
    console.log(`✅ Bot restarted via PM2:\n${stdout}`);
  });
});
