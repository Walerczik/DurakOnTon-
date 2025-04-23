from telegram import Update, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import config

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton(text="Играть!", web_app=WebAppInfo(url=config.WEBAPP_URL))]
    ])
    await update.message.reply_text("Запускаем DurakOnTon!", reply_markup=keyboard)

app = ApplicationBuilder().token(config.TELEGRAM_BOT_TOKEN).build()
app.add_handler(CommandHandler("start", start))

if __name__ == "__main__":
    app.run_polling()
