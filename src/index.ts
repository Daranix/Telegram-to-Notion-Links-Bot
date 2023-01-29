import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { registerHandlers } from './handlers';
import { AppDataSource } from "./data-source";
import { User } from './entities';

dotenv.config();



async function main() {

    await AppDataSource.initialize();
    console.log("Database connected.")
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        throw new Error("Not found TELEGRAM_BOT_TOKEN env variable value");
    }
    
    const bot = new Telegraf(botToken);

    registerHandlers(bot);


    if (process.env.ENVIRONMENT === 'dev') {
        await bot.launch();
    } else { // Production
        // Check docs for more options: https://telegraf.js.org/
        // Start webhook via launch method (preferred)
        await bot.launch({
            webhook: {
                // Public domain for webhook; e.g.: example.com
                domain: process.env.WEBHOOK_DOMAIN!,
                // Port to listen on; e.g.: 8080
                port: parseInt(process.env.PORT!),
                // Optional path to listen for.
                // `bot.secretPathComponent()` will be used by default
                hookPath: process.env.WEBHOOK_PATH,
            },
        });
    }

    console.log("Bot started.")
}

main();


