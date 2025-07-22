const { zokou } = require("../framework/zokou");
const { default: axios } = require('axios');

// Toggle command on/off
const isHackCommandEnabled = true;

zokou({
  nomCom: "hack",
  categorie: "General",
  reaction: "👨‍🏫",
  active: isHackCommandEnabled
}, async (dest, zk, commandeOptions) => {
  const { arg, repondre } = commandeOptions;

  const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const steps = [
    "```Injecting malware...```",
    "```Hacking into device...\nProgress: 0%```",
    "```Transferring photos...\n█ 10%```",
    "```Transfer successful.\n█ █ 20%```",
    "```Transferring videos...\n█ █ █ 30%```",
    "```Transfer successful.\n█ █ █ █ 40%```",
    "```Transferring audio files...\n█ █ █ █ █ 50%```",
    "```Transfer successful.\n█ █ █ █ █ █ 60%```",
    "```Transferring hidden files...\n█ █ █ █ █ █ █ 70%```",
    "```Transfer successful.\n█ █ █ █ █ █ █ █ 80%```",
    "```Accessing WhatsApp chats...\n█ █ █ █ █ █ █ █ █ 90%```",
    "```Transfer complete.\n█ █ █ █ █ █ █ █ █ █ 100%```",
    "```System hijacking in progress...\nConnecting to server...```",
    "```Device successfully connected...\nReceiving data...```",
    "```Data hijacked successfully.\nRemoving traces and malware...```",
    "```HACKING COMPLETED ✅```",
    "```Sending phone documents...```",
    "```✅ Data sent successfully. Connection disconnected.```",
    "*ALL FILES TRANSFERRED SUCCESSFULLY.*"
  ];

  for (const step of steps) {
    await zk.sendMessage(dest, step);
    await sleep(3000); // 3 seconds (not 30s to avoid long delays)
  }
});
