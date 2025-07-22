const { zokou } = require('../framework/zokou');
const fs = require('fs');
const getFBInfo = require('@xaviabot/fb-downloader');
const { default: axios } = require('axios');

// Instagram Downloader
zokou({ nomCom: "igdl", categorie: "Download" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  const link = arg.join(' ');

  if (!link) {
    repondre('Please insert an Instagram video link.');
    return;
  }

  try {
    const igvid = await axios.get(`https://api.vihangayt.com/downloader/ig?url=${link}`);
    const media = igvid.data.data.data[0];

    if (media.type === 'video') {
      zk.sendMessage(dest, {
        video: { url: media.url },
        caption: 'Instagram video downloader powered by *JOEL-Md*'
      }, { quoted: ms });
    } else {
      zk.sendMessage(dest, {
        image: { url: media.url },
        caption: 'Instagram image downloader powered by *𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈*'
      });
    }

  } catch (e) {
    repondre("Error while downloading:\n" + e.message);
  }
});

// Facebook Downloader (HD)
zokou({ nomCom: "fbdl", categorie: "Download", reaction: "📽️" }, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;
  const url = arg.join(' ');

  if (!url) {
    repondre('Insert a public Facebook video link!');
    return;
  }

  try {
    const result = await getFBInfo(url);
    const caption = `🎞️ Title: ${result.title}\n🔗 Link: ${result.url}`;
    await zk.sendMessage(dest, { image: { url: result.thumbnail }, caption }, { quoted: ms });
    await zk.sendMessage(dest, {
      video: { url: result.hd },
      caption: 'Facebook video downloader powered by *𝗡𝗶𝗰𝗼𝗹𝗮𝘂𝘀 𝗗𝗮𝗻𝗶𝗲𝗹😈 𝗮𝗻𝗱 𝗔𝗹𝗶𝘆 𝗔𝗯𝗱𝗮𝗿𝗮𝘇𝘂𝗹😈*'
    }, { quoted: ms });
  } catch (error) {
    console.log("Error:", error);
    repondre('Try using the `fbdl2` command instead.');
  }
});

// Facebook Downloader (SD)
zokou({ nomCom: "fbdl2", categorie: "Download", reaction: "📽️" }, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;
  const url = arg.join(' ');

  if (!url) {
    repondre('Insert a public Facebook video link!');
    return;
  }

  try {
    const result = await getFBInfo(url);
    const caption = `🎞️ Title: ${result.title}\n🔗 Link: ${result.url}`;
    await zk.sendMessage(dest, { image: { url: result.thumbnail }, caption }, { quoted: ms });
    await zk.sendMessage(dest, {
      video: { url: result.sd },
      caption: 'Facebook video downloader powered by *𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈*'
    }, { quoted: ms });
  } catch (error) {
    console.log("Error:", error);
    repondre(error.message);
  }
});

// TikTok Downloader
zokou({ nomCom: "tiktok", categorie: "Download", reaction: "🎵" }, async (dest, zk, commandeOptions) => {
  const { arg, ms, prefixe, repondre } = commandeOptions;
  const videoUrl = arg.join(' ');

  if (!videoUrl) {
    repondre(`Usage:\n${prefixe}tiktok <tiktok_video_link>`);
    return;
  }

  try {
    const response = await axios.get(`https://api.onesytex.my.id/api/tiktok-dl=${videoUrl}`);
    const tik = response.data.data;

    const caption = `👤 Author: ${tik.author}\n📝 Description: ${tik.desc}`;
    await zk.sendMessage(dest, { video: { url: tik.links[0].a }, caption }, { quoted: ms });

  } catch (error) {
    repondre('Failed to fetch TikTok video: ' + error.message);
  }
});

// YouTube Downloader
zokou({ nomCom: "ytdl", categorie: "Download", reaction: "🎬" }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, ms, prefixe } = commandeOptions;
  const ytUrl = arg[0];

  if (!ytUrl) {
    repondre(`Usage:\n${prefixe}ytdl <YouTube Link>`);
    return;
  }

  try {
    const res = await axios.get(`https://api.vihangayt.com/downloader/youtube?url=${ytUrl}`);
    const result = res.data.data;

    const caption = `🎵 *Title:* ${result.title}\n👤 *Author:* ${result.channel}\n📥 *Quality:* ${result.sdQuality}`;
    await zk.sendMessage(dest, { image: { url: result.thumbnail }, caption }, { quoted: ms });
    await zk.sendMessage(dest, {
      video: { url: result.sd },
      caption: 'YouTube video downloaded via *𝗠𝗔𝗥𝗖𝗘𝗨𝗦𝗘-𝗫𝗠𝗗😈*'
    }, { quoted: ms });

  } catch (error) {
    console.error("YouTube Download Error:", error);
    repondre('Failed to download YouTube content: ' + error.message);
  }
});
