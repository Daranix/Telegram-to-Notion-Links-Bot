import { Context, Telegraf } from "telegraf";
import type { Update } from "telegraf/typings/core/types/typegram";

export interface HandlerRegister {
    register(bot: Telegraf<Context<Update>>): void
}