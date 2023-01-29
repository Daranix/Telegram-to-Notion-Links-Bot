import { Context, Telegraf } from "telegraf";
import { Update } from "typegram";

export interface HandlerRegister {
    register(bot: Telegraf<Context<Update>>): void
}