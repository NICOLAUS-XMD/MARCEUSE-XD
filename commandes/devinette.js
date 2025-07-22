const { zokou } = require('../framework/zokou');

// List of riddles with questions and answers
const riddles = [
  { question: "I can fly without wings, who am I?", answer: "The weather" },
  { question: "I'm always hungry, the more I eat, the fatter I become. Who am I?", answer: "A black hole" },
  { question: "I'm strong when I'm down, but weak when I'm up. Who am I?", answer: "The number 6" },
  { question: "I can be short or long, hard or soft, used by anyone from children to musicians. Who am I?", answer: "A pencil" },
  { question: "I'm the beginning of the end, the end of every place, the beginning of eternity, and the end of time and space. Who am I?", answer: "The letter 'e'" },
  { question: "I'm white when dirty and black when clean. Who am I?", answer: "A slate" },
  { question: "I'm a liquid, but remove water and I become solid. Who am I?", answer: "Tea" },
  { question: "I fly without wings, cry without eyes, and death follows me. Who am I?", answer: "The wind" },
  { question: "I have towns but no houses, mountains but no trees, water but no fish. Who am I?", answer: "A map" },
  { question: "I can be read but not written about. You give me, but rarely keep me. Who am I?", answer: "A borrowed book" },
  { question: "I come twice in a week, once in a year, but never in a day. Who am I?", answer: "The letter 'E'" },
  { question: "I'm hard to grasp, but once found, you'll hold me in your hand. Who am I?", answer: "Your breath" },
  { question: "The hotter I get, the colder I become. Who am I?", answer: "Coffee" },
  { question: "I'm the stuff of dreams, I cover broken ideas, I turn souls into wings. Who am I?", answer: "A book" },
  { question: "I start at night and finish in the morning. Who am I?", answer: "The letter 'N'" },
  { question: "I feed on air, earth, and trees. Who am I?", answer: "A fire" }
];

// Riddle command
zokou({ nomCom: "riddle", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;

  // Choose a random riddle
  const riddle = riddles[Math.floor(Math.random() * riddles.length)];

  // Send the riddle question
  await zk.sendMessage(
    dest,
    {
      text: `🧠 *Riddle:* ${riddle.question}\n🕒 You have 30 seconds to think...`,
    },
    { quoted: ms }
  );

  // Wait 30 seconds
  await delay(30000);

  // Send the answer
  await zk.sendMessage(
    dest,
    {
      text: `✅ *Answer:* ${riddle.answer}`,
    },
    { quoted: ms }
  );
});

// Delay utility function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
