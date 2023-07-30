const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load the environment variables from .env
dotenv.config();

const app = express();

// Get the Telegram API Token and chatId from the environment variables
const token = process.env.TELEGRAM_API_TOKEN;
const chatId = process.env.CHAT_ID;

// Create a new instance of the TelegramBot
const bot = new TelegramBot(token, { polling: true });

// Telegram webhook endpoint for receiving order information
app.use(bodyParser.json());
app.post("/order", (req, res) => {
  const { delivery, city, settlementsRegion, product, seller, price } =
    req.body;

  // Compose the message
  const message = `
    New Order:
    Delivery: ${delivery}
    City: ${city}
    Settlements Region: ${settlementsRegion}
    Product: ${product}
    Seller: ${seller}
    Price: ${price}
  `;

  // Send the message to your chat
  bot.sendMessage(chatId, message);

  res.status(200).json({ success: true });
});

// Start the server on a port of your choice
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
