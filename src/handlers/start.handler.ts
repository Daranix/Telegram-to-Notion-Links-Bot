import { Context, Telegraf } from "telegraf";
import type { Update } from "telegraf/typings/core/types/typegram";
import { HandlerRegister } from "../handler";


export class StartCommandHandler implements HandlerRegister {

    register(bot: Telegraf<Context<Update>>): void {
        bot.command("start", (ctx) => {
            ctx.reply("We need your Notion Internal Token to manage your notion link notes database. write /token followed by the notion token to update it.");
        });
    }
}