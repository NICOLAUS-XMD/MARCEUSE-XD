const { zokou } = require("../framework/zokou");
const fancy = require("../commandes/style");

zokou({
    nomCom: "fancy",
    categorie: "Fun",
    reaction: "☑️"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe } = commandeOptions;

    const id = arg[0]?.match(/\d+/)?.join('');
    const text = arg.slice(1).join(" ");

    try {
        // Validate arguments
        if (!id || !text) {
            return await repondre(
                `\nExample: ${prefixe}fancy 10 𝗠𝗮𝗿𝗰𝗲𝘂𝘀𝗲 tech\n` +
                String.fromCharCode(8206).repeat(4001) +
                fancy.list('𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈', fancy)
            );
        }

        const selectedStyle = fancy[parseInt(id) - 1];

        if (selectedStyle) {
            return await repondre(fancy.apply(selectedStyle, text));
        } else {
            return await repondre('_Style not found :(_');
        }

    } catch (error) {
        console.error(error);
        return await repondre('_An error occurred :(_');
    }
});
