import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import TelegramBotUtils from "./TelegramBotUtils";

export interface TBDocument {
    url: string;
    id: string;
}

export interface TBMessage {
    text: string;
    id: number;
}

/**
 * The telegram bot
 */
export default class TelegramBot {

    protected token: string;
    protected name: string;
    protected bot: Telegraf<TelegrafContext>;

    public constructor(token: string, name: string) {
        this.token = token;
        this.name = name;
        this.bot = new Telegraf(token);
    }

    /**
     * Runs the bot
     */
    public async start() {
        return this.bot.startPolling();
    }

    /**
     * On new message
     * @param callback
     */
    public onMessage(callback: (context: TelegrafContext, message: TBMessage) => Promise<any>) {
        this.bot.on("message", async ctx => {
            if (ctx.update.message && ctx.update.message.text) {
                try {
                    await callback(ctx, {text: ctx.update.message.text, id: ctx.update.message.message_id});
                } catch (e) {
                    ctx.reply(TelegramBotUtils.getErrorMessage(e)).then();
                }
            }
        });
    }

    /**
     * On new document
     * @param callback
     */
    public onDocument(callback: (context: TelegrafContext, document: TBDocument) => Promise<any>) {
        this.bot.on("document", async ctx => {
            if (ctx.update.message && ctx.update.message.document) {
                const fileId = ctx.update.message.document!.file_id;
                const fileUrl = await ctx.telegram.getFileLink(fileId);
                try {
                    await callback(ctx, {url: fileUrl, id: fileId});
                } catch (e) {
                    ctx.reply(TelegramBotUtils.getErrorMessage(e)).then();
                }
            }
        });
    }

    /**
     * Stops the bot
     */
    public async stop() {
        return this.bot.stop();
    }

}