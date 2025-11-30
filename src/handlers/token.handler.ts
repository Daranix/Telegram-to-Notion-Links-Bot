import { Context, Telegraf } from "telegraf";
import type { Update } from "telegraf/typings/core/types/typegram";
import { User } from "../entities"
import { HandlerRegister } from "../handler";


export class TokenCommandHandler implements HandlerRegister {

    register(bot: Telegraf<Context<Update>>): void {
        bot.command("token", async (ctx) => {

            const userId = ctx.message.from.id;
            const token = ctx.message.text.split(' ')[1];

            const user = new User();
            user.telegramUserId = userId;
            user.token = token;
            user.setupstep = 2;
            await user.save();

            ctx.replyWithMarkdownV2("We stored associated to this account the token `"+ token + "`, now write the page id we can work in")
        });
    }

}