import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ResetCommandHandler } from './reset.handler';
import { StartCommandHandler } from './start.handler';
import { TextHandler } from './text.handler';
import { TokenCommandHandler } from './token.handler';

const handlerList = [
    StartCommandHandler,
    TokenCommandHandler,
    TextHandler,
    ResetCommandHandler
];

export function registerHandlers(bot: Telegraf<Context<Update>>) {
    for (const handler of handlerList) {
        const instance = new handler();
        console.log("Registered: " + instance.constructor.name)
        instance.register(bot);
    }
}