"use strict";
const axios = require("axios");
const { zokou } = require("../framework/zokou");

zokou(
  { nomCom: "weather", categorie: "General" }, // Badilisha "NEW" kuwa "General" kwa kategoria inayofaa
  async (dest, zk, commandeOptions) => {
    const { text, repondre } = commandeOptions;

    // Angalia ikiwa eneo limepewa
    if (!text) return repondre("Please provide a location!");

    try {
      // Tuma ombi kwa OpenWeatherMap API
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`
      );

      // Tengeneza ujumbe wa hali ya hewa
      let message = `*🌟 Weather in ${text}*\n\n`;
      message += `*Weather:* ${response.data.weather[0].main}\n`;
      message += `*Description:* ${response.data.weather[0].description}\n`;
      message += `*Average Temp:* ${response.data.main.temp}°C\n`;
      message += `*Feels Like:* ${response.data.main.feels_like}°C\n`;
      message += `*Pressure:* ${response.data.main.pressure} hPa\n`;
      message += `*Humidity:* ${response.data.main.humidity}%\n`;
      message += `*Wind Speed:* ${response.data.wind.speed} m/s\n`;
      message += `*Latitude:* ${response.data.coord.lat}\n`;
      message += `*Longitude:* ${response.data.coord.lon}\n`;
      message += `*Country:* ${response.data.sys.country}\n`;

      // Tuma ujumbe kwenye WhatsApp
      await zk.sendMessage(dest, { text: message }, { quoted: commandeOptions.ms });
    } catch (error) {
      // Shughulikia hitilafu (k.m., eneo lisilo sahihi au API kushindwa)
      console.error("Error fetching weather:", error.message);
      await repondre("Error: Could not fetch weather data. Please check the location or try again later.");
    }
  }
);