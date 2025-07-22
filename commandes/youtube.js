"use strict";
const { zokou } = require("../framework/zokou");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");

zokou(
  { nomCom: ["play", "song"], categorie: "Search", reaction: "?" },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    if (!arg[0]) {
      return repondre("Please provide the name of a song.");
    }

    try {
      const query = arg.join(" ");
      const search = await yts(query);
      const videos = search.videos;

      if (!videos || videos.length === 0) {
        return repondre("No song found.");
      }

      const video = videos[0];
      const infoMess = {
        image: { url: video.thumbnail },
        caption: `*Song Details*\n\n` +
                 `*Title:* ${video.title}\n` +
                 `*Duration:* ${video.timestamp}\n` +
                 `*Uploaded:* ${video.ago}\n` +
                 `*Author:* ${video.author.name}\n` +
                 `*Views:* ${video.views}\n` +
                 `*URL:* ${video.url}\n\n` +
                 `*Downloading audio...*`
      };

      await zk.sendMessage(dest, infoMess, { quoted: ms });

      const filename = `audio_${Date.now()}.mp3`; // Jina la faili la kipekee
      const audioStream = ytdl(video.url, { filter: "audioonly", quality: "highestaudio" });
      const fileStream = fs.createWriteStream(filename);
      audioStream.pipe(fileStream);

      fileStream.on("finish", async () => {
        try {
          await zk.sendMessage(dest, { audio: { url: filename }, mimetype: "audio/mpeg" }, { quoted: ms, ptt: false });
          console.log("Audio sent successfully!");
          fs.unlink(filename, (err) => { // Safisha faili ya muda
            if (err) console.error("Error deleting file:", err);
          });
        } catch (error) {
          console.error("Error sending audio:", error);
          await repondre("An error occurred while sending the audio.");
        }
      });

      fileStream.on("error", (error) => {
        console.error("Error writing audio file:", error);
        repondre("An error occurred while writing the audio file.");
      });
    } catch (error) {
      console.error("Error during search or download:", error);
      await repondre("An error occurred while searching or downloading the song.");
    }
  }
);

zokou(
  { nomCom: "video", categorie: "Search", reaction: "?" },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    if (!arg[0]) {
      return repondre("Please provide the name of a video.");
    }

    try {
      const query = arg.join(" ");
      const search = await yts(query);
      const videos = search.videos;

      if (!videos || videos.length === 0) {
        return repondre("No video found.");
      }

      const video = videos[0];
      const infoMess = {
        image: { url: video.thumbnail },
        caption: `*Video Details*\n\n` +
                 `*Title:* ${video.title}\n` +
                 `*Duration:* ${video.timestamp}\n` +
                 `*Uploaded:* ${video.ago}\n` +
                 `*Author:* ${video.author.name}\n` +
                 `*Views:* ${video.views}\n` +
                 `*URL:* ${video.url}\n\n` +
                 `*Downloading video...*`
      };

      await zk.sendMessage(dest, infoMess, { quoted: ms });

      const videoInfo = await ytdl.getInfo(video.url);
      const format = ytdl.chooseFormat(videoInfo.formats, { quality: "18" });
      const filename = `video_${Date.now()}.mp4`; // Jina la faili la kipekee
      const videoStream = ytdl.downloadFromInfo(videoInfo, { format });
      const fileStream = fs.createWriteStream(filename);
      videoStream.pipe(fileStream);

      fileStream.on("finish", async () => {
        try {
          await zk.sendMessage(dest, { video: { url: filename }, caption: "Video downloaded successfully!", gifPlayback: false }, { quoted: ms });
          console.log("Video sent successfully!");
          fs.unlink(filename, (err) => { // Safisha faili ya muda
            if (err) console.error("Error deleting file:", err);
          });
        } catch (error) {
          console.error("Error sending video:", error);
          await repondre("An error occurred while sending the video.");
        }
      });

      fileStream.on("error", (error) => {
        console.error("Error writing video file:", error);
        repondre("An error occurred while writing the video file.");
      });
    } catch (error) {
      console.error("Error during search or download:", error);
      await repondre("An error occurred while searching or downloading the video.");
    }
  }
);