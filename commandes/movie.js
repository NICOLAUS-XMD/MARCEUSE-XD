const { zokou } = require("../framework/zokou");
const { getJson } = require("../framework/utils");

zokou({
  nomCom: "movie",
  categorie: "Search",
  reaction: "💿"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  if (!arg[0]) {
    return repondre("Quel film veux-tu ?");
  }

  const movieTitle = arg.join(" ");
  const movie = await getJson(
    `http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(movieTitle)}&plot=full`
  );

  if (movie.Response !== 'True') {
    return repondre('*Not found*');
  }

  let msg = '';
  const url = movie.Poster;
  delete movie.Poster;
  delete movie.Response;
  delete movie.Ratings;

  for (const key in movie) {
    if (movie[key] !== 'N/A') {
      msg += `*${key}* : ${movie[key]}\n`;
    }
  }

  if (url === 'N/A') {
    return repondre(msg.trim());
  } else {
    try {
      await zk.sendMessage(origineMessage.from, {
        image: { url },
        caption: msg.trim()
      }, { quoted: origineMessage });
    } catch (err) {
      console.error("❌ Failed to send movie image:", err);
      repondre(msg.trim());
    }
  }
});
