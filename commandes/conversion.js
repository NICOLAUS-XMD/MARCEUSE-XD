const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { zokou } = require("../framework/zokou");
const traduire = require("../framework/traduction");
const { downloadMediaMessage, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const axios = require('axios');
const FormData = require('form-data');
const { exec } = require("child_process");

// Upload media to Telegraph
async function uploadToTelegraph(Path) {
  if (!fs.existsSync(Path)) {
      throw new Error("File does not exist");
  }

  try {
      const form = new FormData();
      form.append("file", fs.createReadStream(Path));

      const { data } = await axios.post("https://telegra.ph/upload", form, {
          headers: {
              ...form.getHeaders(),
          },
      });

      if (data && data[0] && data[0].src) {
          return "https://telegra.ph" + data[0].src;
      } else {
          throw new Error("Error retrieving the video link");
      }
  } catch (err) {
      throw new Error(String(err));
  }
}

// Command: sticker
zokou({ nomCom: "sticker", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
  let { ms, mtype, arg, repondre, nomAuteurMessage } = commandeOptions;
  let txt = JSON.stringify(ms.message);

  let mime = mtype === "imageMessage" || mtype === "videoMessage";
  let tagImage = mtype === "extendedTextMessage" && txt.includes("imageMessage");
  let tagVideo = mtype === "extendedTextMessage" && txt.includes("videoMessage");

  const alea = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;
  const stickerFileName = alea(".webp");

  // IMAGE
  if (mtype === "imageMessage" || tagImage) {
    let downloadFilePath = ms.message.imageMessage || ms.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
    const media = await downloadContentFromMessage(downloadFilePath, "image");
    let buffer = Buffer.from([]);
    for await (const elm of media) buffer = Buffer.concat([buffer, elm]);

    sticker = new Sticker(buffer, {
      pack: "joel md",
      author: nomAuteurMessage,
      type: arg.includes("crop") || arg.includes("c") ? StickerTypes.CROPPED : StickerTypes.FULL,
      quality: 100,
    });

  // VIDEO
  } else if (mtype === "videoMessage" || tagVideo) {
    let downloadFilePath = ms.message.videoMessage || ms.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
    const stream = await downloadContentFromMessage(downloadFilePath, "video");
    let buffer = Buffer.from([]);
    for await (const elm of stream) buffer = Buffer.concat([buffer, elm]);

    sticker = new Sticker(buffer, {
      pack: "joel md",
      author: nomAuteurMessage,
      type: arg.includes("-r") || arg.includes("-c") ? StickerTypes.CROPPED : StickerTypes.FULL,
      quality: 40,
    });

  } else {
    repondre("Please mention an image or video!");
    return;
  }

  await sticker.toFile(stickerFileName);
  await zk.sendMessage(origineMessage, { sticker: fs.readFileSync(stickerFileName) }, { quoted: ms });

  try {
    fs.unlinkSync(stickerFileName);
  } catch (e) {
    console.log(e);
  }
});

// Command: scrop
zokou({ nomCom: "scrop", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, msgRepondu, arg, repondre, nomAuteurMessage } = commandeOptions;

  if (!msgRepondu) {
    repondre('Make sure to mention the media');
    return;
  }

  const pack = arg[0] ? arg.join(' ') : nomAuteurMessage;
  const mediamsg = msgRepondu.imageMessage || msgRepondu.videoMessage || msgRepondu.stickerMessage;

  if (!mediamsg) {
    repondre('Please mention media');
    return;
  }

  const stick = await zk.downloadAndSaveMediaMessage(mediamsg);

  const stickerMess = new Sticker(stick, {
    pack,
    type: StickerTypes.CROPPED,
    categories: ["🤩", "🎉"],
    id: "12345",
    quality: 70,
    background: "transparent",
  });

  const stickerBuffer2 = await stickerMess.toBuffer();
  zk.sendMessage(origineMessage, { sticker: stickerBuffer2 }, { quoted: ms });
});

// Command: take
zokou({ nomCom: "take", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, msgRepondu, arg, repondre, nomAuteurMessage } = commandeOptions;

  if (!msgRepondu) {
    repondre('Make sure to mention the media');
    return;
  }

  const pack = arg[0] ? arg.join(' ') : nomAuteurMessage;
  const mediamsg = msgRepondu.imageMessage || msgRepondu.videoMessage || msgRepondu.stickerMessage;

  if (!mediamsg) {
    repondre('Please mention media');
    return;
  }

  const stick = await zk.downloadAndSaveMediaMessage(mediamsg);

  const stickerMess = new Sticker(stick, {
    pack,
    type: StickerTypes.FULL,
    categories: ["🤩", "🎉"],
    id: "12345",
    quality: 70,
    background: "transparent",
  });

  const stickerBuffer2 = await stickerMess.toBuffer();
  zk.sendMessage(origineMessage, { sticker: stickerBuffer2 }, { quoted: ms });
});

// Command: write (adds text to image then makes sticker)
zokou({ nomCom: "write", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, msgRepondu, arg, repondre, nomAuteurMessage } = commandeOptions;

  if (!msgRepondu || !msgRepondu.imageMessage) {
    repondre('Please mention an image');
    return;
  }

  const text = arg.join(' ');
  if (!text) {
    repondre('Please insert the text');
    return;
  }

  const mediamsg = msgRepondu.imageMessage;
  const image = await zk.downloadAndSaveMediaMessage(mediamsg);

  const data = new FormData();
  data.append('image', fs.createReadStream(image));

  const clientId = 'b40a1820d63cd4e'; // Imgur client ID
  const headers = {
    'Authorization': `Client-ID ${clientId}`,
    ...data.getHeaders()
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.imgur.com/3/image',
    headers,
    data
  };

  try {
    const response = await axios(config);
    const imageUrl = response.data.data.link;

    const meme = `https://api.memegen.link/images/custom/-/${text}.png?background=${imageUrl}`;

    const stickerMess = new Sticker(meme, {
      pack: nomAuteurMessage,
      author: 'Nicolaus Daniel😈',
      type: StickerTypes.FULL,
      categories: ["🤩", "🎉"],
      id: "12345",
      quality: 70,
      background: "transparent",
    });

    const stickerBuffer2 = await stickerMess.toBuffer();
    zk.sendMessage(origineMessage, { sticker: stickerBuffer2 }, { quoted: ms });

  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    repondre('An error occurred while creating the meme.');
  }
});

// Command: photo (convert sticker to image)
zokou({ nomCom: "photo", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (dest, zk, commandeOptions) => {
  const { ms, msgRepondu, repondre } = commandeOptions;

  if (!msgRepondu || !msgRepondu.stickerMessage) {
    repondre('Please mention a static sticker');
    return;
  }

  let mediaMess = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
  const alea = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;
  let ran = alea(".png");

  exec(`ffmpeg -i ${mediaMess} ${ran}`, (err) => {
    fs.unlinkSync(mediaMess);
    if (err) {
      zk.sendMessage(dest, { text: 'Only non-animated stickers supported' }, { quoted: ms });
      return;
    }
    let buffer = fs.readFileSync(ran);
    zk.sendMessage(dest, { image: buffer }, { quoted: ms });
    fs.unlinkSync(ran);
  });
});

// Command: trt (translate text message)
zokou({ nomCom: "trt", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (dest, zk, commandeOptions) => {
  const { msgRepondu, repondre, arg } = commandeOptions;

  if (msgRepondu) {
    try {
      if (!arg || !arg[0]) {
        repondre('(example: trt en)');
        return;
      }

      let translatedText = await traduire(msgRepondu.conversation, { to: arg[0] });
      repondre(translatedText);

    } catch (error) {
      repondre('Please mention a text message');
    }
  } else {
    repondre('Please mention a text message');
  }
});

// Command: url (upload image/video to telegraph)
zokou({ nomCom: "url", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
  const { msgRepondu, repondre } = commandeOptions;

  if (!msgRepondu) {
    repondre('Please mention an image or video');
    return;
  }

  let mediaPath;

  if (msgRepondu.videoMessage) {
    mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
  } else if (msgRepondu.imageMessage) {
    mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
  } else {
    repondre('Please mention an image or video');
    return;
  }

  try {
    const telegraphUrl = await uploadToTelegraph(mediaPath);
    fs.unlinkSync(mediaPath);
    repondre(telegraphUrl);
  } catch (error) {
    console.error('Error creating Telegraph link:', error);
    repondre('Oops, something went wrong');
  }
});
