"use strict";
const { zokou } = require("../framework/zokou");
const { addstickcmd, deleteCmd, getAllStickCmds } = require("../bdd/stickcmd");

zokou(
  {
    commandName: "setcmd", // Changed from nomCom
    category: "stickcmd", // Changed from categorie
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, superUser, msgRepondu } = commandeOptions;

    if (!superUser) {
      await repondre("Only moderators can use this command.");
      return;
    }

    if (!msgRepondu || !msgRepondu.stickerMessage || !msgRepondu.stickerMessage.url) {
      await repondre("Please mention a valid sticker.");
      return;
    }

    if (!arg || !arg[0] || !arg[0].trim()) {
      await repondre("Please provide a valid command name.");
      return;
    }

    const cmdName = arg[0].trim().toLowerCase();

    // Basic validation for command name
    if (!/^[a-z0-9_-]+$/.test(cmdName)) {
      await repondre("Command name must contain only letters, numbers, underscores, or hyphens.");
      return;
    }

    try {
      await addstickcmd(cmdName, msgRepondu.stickerMessage.url);
      await repondre("Sticker command saved successfully.");
    } catch (error) {
      console.error("Error saving sticker command:", error);
      await repondre("An error occurred while saving the sticker command.");
    }
  }
);

zokou(
  {
    commandName: "delcmd", // Changed from nomCom
    category: "stickcmd", // Changed from categorie
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, superUser } = commandeOptions;

    if (!superUser) {
      await repondre("Only moderators can use this command.");
      return;
    }

    if (!arg || !arg[0] || !arg[0].trim()) {
      await repondre("Please provide the name of the command to delete.");
      return;
    }

    const cmdName = arg[0].trim().toLowerCase();

    try {
      const deleted = await deleteCmd(cmdName);
      if (deleted) {
        await repondre(`The command "${cmdName}" was deleted successfully.`);
      } else {
        await repondre(`The command "${cmdName}" doesn't exist.`);
      }
    } catch (error) {
      console.error("Error deleting sticker command:", error);
      await repondre("An error occurred while deleting the command.");
    }
  }
);

zokou(
  {
    commandName: "allcmd", // Changed from nomCom
    category: "stickcmd", // Changed from categorie
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) {
      await repondre("Only moderators can use this command.");
      return;
    }

    try {
      const allCmds = await getAllStickCmds();

      if (allCmds.length > 0) {
        const cmdList = allCmds.map((cmd) => cmd.cmd).join(", ");
        await repondre(`*List of all sticker commands:*\n${cmdList}`);
      } else {
        await repondre("No sticker commands saved.");
      }
    } catch (error) {
      console.error("Error fetching sticker commands:", error);
      await repondre("An error occurred while fetching the command list.");
    }
  }
);