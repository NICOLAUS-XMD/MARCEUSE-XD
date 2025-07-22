const { zokou } = require('../framework/zokou');
const gis = require('g-i-s');

zokou({
  nomCom: "img",
  categorie: "Search",
  reaction: "📷"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Please enter the name of the image to search for!');
    return;
  }

  const searchTerm = arg.join(" ");

  gis(searchTerm, async (error, results) => {
    if (error || !results || results.length === 0) {
      repondre("An error occurred while fetching the images or no images found.");
      return;
    }

    repondre(`🔍 Searching for "${searchTerm}"...`);

    const imagesToSend = results.slice(0, 5); // Only send 5 images
    for (const img of imagesToSend) {
      await zk.sendMessage(dest, { image: { url: img.url } }, { quoted: ms });
    }
  });
});
