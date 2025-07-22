const { zokou } = require("../framework/zokou");
const { getytlink, ytdwn } = require("../framework/ytdl-core");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const youtubedl = require("youtube-dl-exec"); // Added missing dependency
const fs = require("fs");
const path = require("path"); // Added for file path handling
const os = require("os"); // Added for temporary file paths

// YouTube Search Command
zokou(
  { nomCom: "yts", categorie: "Search", reaction: "?" },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    const query = arg.join(" ");

    if (!query) {
      repondre("Please provide a search query.");
      return;
    }

    try {
      const info = await yts(query);
      const videos = info.videos;

      if (!videos || videos.length === 0) {
        repondre("No videos found for your query.");
        return;
      }

      // Limit to 15 videos or fewer if less are available
      let captions = "=== YouTube Search Results ===\n";
      for (let i = 0; i < Math.min(videos.length, 15); i++) {
        captions += `${i + 1}. Title: ${videos[i].title}\nDuration: ${videos[i].timestamp}\nURL: ${videos[i].url}\n\n`;
      }
      captions += "=== Reply with the number to download ===";

      zk.sendMessage(
        dest,
        { image: { url: videos[0].thumbnail }, caption: captions },
        { quoted: ms }
      );
    } catch (error) {
      console.error("Error in YouTube search:", error);
      repondre("An error occurred while searching: " + error.message);
    }
  }
);

// Download YouTube Video Command
zokou(
  { nomCom: "ytmp4", categorie: "Download", reaction: "?" },
  async (origineMessage, zk, commandeOptions) => {
    const { arg, ms, repondre } = commandeOptions;

    if (!arg[0]) {
      repondre("Please provide a YouTube video URL.");
      return;
    }

    const videoUrl = arg.join(" ");
    try {
      if (!ytdl.validateURL(videoUrl)) {
        repondre("Invalid YouTube URL.");
        return;
      }

      // Get video info
      const videoInfo = await ytdl.getInfo(videoUrl);
      const format = ytdl.chooseFormat(videoInfo.formats, { quality: "18" });

      // Use a unique temporary file path
      const filename = path.join(
        os.tmpdir(),
        `video_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`
      );

      // Download video to temporary file
      const videoStream = ytdl.downloadFromInfo(videoInfo, { format });
      const fileStream = fs.createWriteStream(filename);
      videoStream.pipe(fileStream);

      fileStream.on("finish", async () => {
        try {
          // Send video
          await zk.sendMessage(
            origineMessage,
            {
              video: { url: filename },
              caption: "Powered by *Zokou-Md*",
              gifPlayback: false,
            },
            { quoted: ms }
          );
          // Clean up temporary file
          fs.unlink(filename, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
        } catch (err) {
          console.error("Error sending video:", err);
          repondre("Error sending video: " + err.message);
        }
      });

      fileStream.on("error", (error) => {
        console.error("Error writing video file:", error);
        repondre("Error writing video file: " + error.message);
      });
    } catch (error) {
      console.error("Error downloading video:", error);
      repondre("Error downloading video: " + error.message);
    }
  }
);

// Download YouTube Audio Command
zokou(
  { nomCom: "ytmp3", categorie: "Download", reaction: "?" },
  async (origineMessage, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    if (!arg[0]) {
      repondre("Please provide a YouTube video URL.");
      return;
    }

    const videoUrl = arg.join(" ");
    try {
      if (!ytdl.validateURL(videoUrl)) {
        repondre("Invalid YouTube URL.");
        return;
      }

      // Use a unique temporary file path
      const filename = path.join(
        os.tmpdir(),
        `audio_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`
      );

      // Download audio
      const audioStream = ytdl(videoUrl, {
        filter: "audioonly",
        quality: "highestaudio",
      });
      const fileStream = fs.createWriteStream(filename);
      audioStream.pipe(fileStream);

      fileStream.on("finish", async () => {
        try {
          // Send audio
          await zk.sendMessage(
            origineMessage,
            { audio: { url: filename }, mimetype: "audio/mpeg" },
            { quoted: ms, ptt: false }
          );
          console.log("Audio sent successfully!");
          // Clean up temporary file
          fs.unlink(filename, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
        }

        catch (err) {
          console.error("Error sending audio:", err);
          repondre("Error sending audio: " + err.message);
        }
      });

      fileStream.on("error", (error) => {
        console.error("Error writing audio file:", error);
        repondre("Error writing audio file: " + error.message);
      });
    } catch (error) {
      console.error("Error downloading audio:", error);
      repondre("Error downloading audio: " + error.message);
    }
  }
);

// Download Audio (YouTube or Other URLs)
zokou(
  { nomCom: "mp3", categorie: "Download", reaction: "?" },
  async (origineMessage, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    if (!arg[0]) {
      repondre("Please provide a video URL.");
      return;
    }

    const videoUrl = arg[0];
    try {
      if (ytdl.validateURL(videoUrl)) {
        // Reuse ytmp3 logic for YouTube URLs
        const ytmp3Command = zokou.commands.find((cmd) => cmd.nomCom === "ytmp3");
        if (ytmp3Command) {
          await ytmp3Command.action(origineMessage, zk, {
            ...commandeOptions,
            arg: [videoUrl],
          });
        } else {
          repondre("Internal error: ytmp3 command not found.");
        }
      } else {
        // Handle non-YouTube URLs with youtube-dl-exec
        const { stdout } = await youtubedl(videoUrl, {
          extractAudio: true,
          audioFormat: "mp3",
          noWarnings: true,
          noCallHome: true,
          preferFreeFormats: true,
          youtubeSkipDashManifest: true,
        });

        const audioUrl = stdout.trim();
        await zk.sendMessage(
          origineMessage,
          { audio: { url: audioUrl }, mimetype: "audio/mpeg" },
          { quoted: ms, ptt: false }
        );
        console.log("Audio sent successfully!");
      }
    } catch (error) {
      console.error("Error downloading or converting audio:", error);
      repondre("Error downloading or converting audio: " + error.message);
    }
  }
);