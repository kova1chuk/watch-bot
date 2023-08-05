const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load the environment variables from .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Get the Telegram API Token and chatId from the environment variables
const token = process.env.TELEGRAM_API_TOKEN;
const chatId = process.env.CHAT_ID;

// Create a new instance of the TelegramBot
const bot = new TelegramBot(token, { polling: true });

// Listen for incoming text messages
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  // If the user sends the command /getChatId, the bot will reply with the chatId
  if (message === "/getChatId") {
    bot.sendMessage(chatId, `Your chatId is: ${chatId}`);
  }

  // Process other commands or messages here...
});

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    // "http://localhost:3000",
    // "http://localhost:8080",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Telegram webhook endpoint for receiving order information
// Parse JSON data in the request body
app.use(bodyParser.json());
app.post("/order", (req, res) => {
  const {
    delivery,
    city,
    settlementsRegion,
    product,
    seller,
    price,
    name,
    phoneNumber,
    selectedShippingTab,
    shipping,
    ukr,
    nova,
  } = req.body;

  // Compose the message
  let message = `🚀 New Order 🛍️\n\n`;
  // message += `Delivery Method: ${delivery}\n`;
  // message += `City: ${city}\n`;
  // message += `Settlements Region: ${settlementsRegion}\n`;
  message += `${product}\n`; // Use product directly since it's already a part of req.body
  message += `${name}\n`; // Use name directly since it's already a part of req.body
  message += `Номер телефону: ${phoneNumber}\n`; // Use phoneNumber directly since it's already a part of req.body
  // message += `${
  //   selectedShippingTab === "nova"
  //     ? `Нова Пошта - ${nova}`
  //     : `Укрпошта - ${ukr}`
  // }\n`;
  message += `Доставка: ${shipping}\n`;
  message += `Price: ${price}\n`;

  // Send the message to your chat
  bot.sendMessage(chatId, message);

  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
