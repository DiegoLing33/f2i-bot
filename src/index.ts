import dotenv from "dotenv";
import fs from "fs";
import ImageIO from "f2i/dist/image/ImageIO";
import TelegramBot from "./bot/TelegramBot";
import TelegramBotUtils from "./bot/TelegramBotUtils";

// .env config
dotenv.config();
TelegramBotUtils.SHOULD_SEND_TEXT_IF_MORE = 600;


(async () => {
    // Bot instance
    const bot = new TelegramBot(process.env.botToken!, process.env.botName!);

    bot.onDocument(async (context, document) => {
        const fileName = 'file_' + document.id + ".png";

        await TelegramBotUtils.downloadImageAndSave(document.url, fileName);
        const text = await TelegramBotUtils.getTextFromImage(fileName);

        if (text.length > TelegramBotUtils.SHOULD_SEND_TEXT_IF_MORE) {
            const decodedFileName = "decoded.txt";

            fs.writeFileSync(decodedFileName, text);
            await context.replyWithDocument({source: decodedFileName}, {caption: "Декодированный текст"});
            fs.unlinkSync(decodedFileName);

        } else {
            await context.reply('Текст с изображения: ' + text);
        }
    });

    // On message
    bot.onMessage(async (context, message) => {
        // Save image
        const filePath = message.id + '.png';
        const image = await ImageIO.textToImage(message.text);
        image.write(filePath);

        // Bot reply
        await context.deleteMessage(context.message!.message_id);
        await context.replyWithDocument({source: filePath});

        fs.unlinkSync(filePath);
        return context.reply("Готово!");
    });


    await bot.start();
})();