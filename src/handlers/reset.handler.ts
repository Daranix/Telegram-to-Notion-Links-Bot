import { Context, Telegraf } from "telegraf";
import type { Update } from "telegraf/typings/core/types/typegram";
import { User } from "../entities";
import { HandlerRegister } from "../handler";


export class ResetCommandHandler implements HandlerRegister {

    register(bot: Telegraf<Context<Update>>): void {
        bot.command("removedata", async (ctx) => {
            console.log("Hello")
            const userId = ctx.message.from.id;
            const user = await User.findOneBy({ telegramUserId: userId });
            if (user) {
                await user.remove();
                ctx.reply("User data removed")
            } else {
                ctx.reply("Not found user with that ID")
            }
        });
    }
}