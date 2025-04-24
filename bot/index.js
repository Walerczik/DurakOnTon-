const { Telegraf } = require('telegraf');
const { BOT_TOKEN, FRONTEND_URL } = require('./config');
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Добро пожаловать в DurakOnTon!', {
    reply_markup: {
      keyboard: [[{ text: 'Играть', web_app: { url: FRONTEND_URL } }]],
      resize_keyboard: true
    }
  });
});

bot.launch();
console.log('Бот запущен');
