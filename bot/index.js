import { Telegraf } from "telegraf";
import { BOT_TOKEN, FRONTEND_URL } from "./config.js";

const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => {
  ctx.reply("Добро пожаловать в DurakOnTon!", {
    reply_markup: {
      inline_keyboard: [[
        { text: "Играть!", web_app: { url: FRONTEND_URL } }
      ]]
    }
  });
});

bot.launch();
console.log("Bot started");
