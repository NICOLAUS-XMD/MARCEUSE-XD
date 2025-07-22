const { zokou } = require("../framework/zokou");
const axios = require('axios');
const cheerio = require('cheerio');
const func = require('../framework/mesfonctions');
const hdb = require('../bdd/hentai');

// Helper function for NSFW check
async function isAllowedNSFWGroup(message, repondre, verifGroupe, superUser) {
  if (!verifGroupe && !superUser) {
    await repondre(`This command is reserved for groups only.`);
    return false;
  }

  const allowed = await hdb.checkFromHentaiList(message);
  if (!allowed && !superUser) {
    await repondre(`This group is not marked as NSFW. Calm down.`);
    return false;
  }

  return true;
}

// Common handler for image-based hentai commands
async function sendHentaiImages(message, zk, ms, repondre, url) {
  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;
      await zk.sendMessage(message, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    await repondre('An error occurred while fetching the data: ' + error.message);
  }
}

// Commands: waifu, trap, hneko, blowjob
const hentaiCommands = [
  { name: "hwaifu", api: "https://api.waifu.pics/nsfw/waifu" },
  { name: "trap", api: "https://api.waifu.pics/nsfw/trap" },
  { name: "hneko", api: "https://api.waifu.pics/nsfw/neko" },
  { name: "blowjob", api: "https://api.waifu.pics/nsfw/blowjob" },
];

hentaiCommands.forEach(({ name, api }) => {
  zokou({
    nomCom: name,
    categorie: "Hentai",
    reaction: "🙄"
  }, async (message, zk, options) => {
    const { repondre, ms, verifGroupe, superUser } = options;
    if (!(await isAllowedNSFWGroup(message, repondre, verifGroupe, superUser))) return;
    await sendHentaiImages(message, zk, ms, repondre, api);
  });
});

// hentai video command
zokou({
  nomCom: "hentaivid",
  categorie: "Hentai",
  reaction: "🙄"
}, async (message, zk, options) => {
  const { repondre, ms, verifGroupe, superUser } = options;

  if (!(await isAllowedNSFWGroup(message, repondre, verifGroupe, superUser))) return;

  try {
    const videos = await fetchHentaiVideos();
    const randomIndex = Math.floor(Math.random() * Math.min(videos.length, 10));
    const selected = videos[randomIndex];

    await zk.sendMessage(message, {
      video: { url: selected.video_1 },
      caption: `*Title:* ${selected.title}\n*Category:* ${selected.category}`
    }, { quoted: ms });

  } catch (error) {
    console.log(error);
    await repondre('Failed to retrieve hentai video.');
  }
});

// Scraping hentai videos
async function fetchHentaiVideos() {
  return new Promise((resolve, reject) => {
    const page = Math.floor(Math.random() * 1153);
    axios.get('https://sfmcompile.club/page/' + page)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const results = [];

        $('#primary > div > div > ul > li > article').each((i, el) => {
          results.push({
            title: $(el).find('header > h2').text(),
            link: $(el).find('header > h2 > a').attr('href'),
            category: $(el).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
            share_count: $(el).find('span.entry-shares').text(),
            views_count: $(el).find('span.entry-views').text(),
            type: $(el).find('source').attr('type') || 'image/jpeg',
            video_1: $(el).find('source').attr('src') || $(el).find('img').attr('data-src'),
            video_2: $(el).find('video > a').attr('href') || ''
          });
        });

        resolve(results);
      })
      .catch(reject);
  });
}
