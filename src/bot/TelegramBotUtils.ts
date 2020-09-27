/*
 * ██╗░░░░░██╗███╗░░██╗░██████╗░░░░██████╗░██╗░░░░░░█████╗░░█████╗░██╗░░██╗
 * ██║░░░░░██║████╗░██║██╔════╝░░░░██╔══██╗██║░░░░░██╔══██╗██╔══██╗██║░██╔╝
 * ██║░░░░░██║██╔██╗██║██║░░██╗░░░░██████╦╝██║░░░░░███████║██║░░╚═╝█████═╝░
 * ██║░░░░░██║██║╚████║██║░░╚██╗░░░██╔══██╗██║░░░░░██╔══██║██║░░██╗██╔═██╗░
 * ███████╗██║██║░╚███║╚██████╔╝░░░██████╦╝███████╗██║░░██║╚█████╔╝██║░╚██╗
 * ╚══════╝╚═╝╚═╝░░╚══╝░╚═════╝░░░░╚═════╝░╚══════╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝
 *
 * Developed by Yakov V. Panov (C) Ling • Black 2020
 * @site http://ling.black
 */

import {TelegrafContext} from "telegraf/typings/context";
import fs from "fs";
import Base64 from "../utils/Base64";
import ImageIO from "f2i/dist/image/ImageIO";

/**
 * Telegram bot utilities
 */
const TelegramBotUtils = {

    SHOULD_SEND_TEXT_IF_MORE: 600,

    /**
     * Returns the error message
     * @param e
     */
    getErrorMessage(e: any) {
        return "Что-то пошло не так 😞\n\nПодробности: " + e;
    },

    /**
     * Downloads image and save it to path
     * @param url
     * @param path
     */
    async downloadImageAndSave(url: string, path: string) {
        const response = await Base64.downloadImage(url);
        fs.writeFileSync(path, response, {encoding: 'base64'});
        return response;
    },

    /**
     * Returns the text from image and unlinks image file
     * @param path
     * @param andUnlink
     */
    async getTextFromImage(path: string, andUnlink = true): Promise<string>{
        const text = await ImageIO.imagePathToText(path);
        if(andUnlink) fs.unlinkSync(path);
        return text;
    }

};

export default TelegramBotUtils;