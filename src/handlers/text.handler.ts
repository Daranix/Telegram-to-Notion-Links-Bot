import { Client } from "@notionhq/client";
import { create } from "domain";
import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { User } from "../entities";
import { ManagedError } from "../errors/managed-error";
import { HandlerRegister } from "../handler";
import { isValidHttpUrl } from "../utils/url-validate";
import { load as cheerioLoad } from 'cheerio';

export class TextHandler implements HandlerRegister {


    register(bot: Telegraf<Context<Update>>): void {
        bot.on("text", async (ctx, next) => {

            if (ctx.message.text.startsWith('/')) { // If it's a command just continue to the command handler
                return next();
            }

            const userId = ctx.message.from.id;
            const user = await User.findOneBy({ telegramUserId: userId });
            if (!user) {
                ctx.reply("We need your Notion Internal Token to manage your links notes database. use /token");
                return;
            }

            if (!user.page && user.setupstep === 2) {
                const pageId = ctx.message.text;
                try {
                    await this.createNotionDatabase(user, pageId);
                    await ctx.reply("The database store has been created sucessfully ! now you can write any links with tags.")
                } catch (ex) {
                    const exception = ex as any;
                    if ('code' in exception) {
                        const managedError = exception as ManagedError;
                        await ctx.reply(managedError.message);
                    }
                }
                return;
            }

            // All verifications passed write link into database
            try {
                await this.appendRow(user, ctx.message.text);
                await ctx.reply("Link stored sucessfully")
            } catch(ex) {
                const exception = ex as any;
                if ('code' in exception) {
                    const managedError = exception as ManagedError;
                    await ctx.reply(managedError.message);
                }
            }


        });
    }

    async createNotionDatabase(user: User, pageId: string) {
        // Create database
        const client = new Client({
            auth: user.token,
            notionVersion: "2025-09-03", // Specify the new API version
        });

        try {
            await client.pages.retrieve({ page_id: pageId })
        } catch (ex) {
            throw new ManagedError('PAGE_ID_ERROR', "Not found page with the specified id");
        }

        const createdDb = await client.databases.create({
            parent: {
                type: "page_id",
                page_id: pageId
            },
            title: [
                {
                    type: "text",
                    text: {
                        content: "Notion DB Telegram",
                        link: null
                    }
                }
            ],
            initial_data_source: {
                properties: {
                    Name: {
                        title: {}
                    },
                    Link: {
                        url: {}
                    },
                    Tags: {
                        multi_select: {}
                    },
                }
            }
        });

        user.page = pageId;
        user.setupstep = 3;
        user.database = createdDb.id;
        await user.save();
    }

    async appendRow(user: User, text: string) {

        const textSplit = text.split(" ");
        const link = textSplit[0];

        // Validate URL
        if(!isValidHttpUrl(link)) {
            throw new ManagedError('INVALID_LINK', "The link specified is not valid");
        }

        let tags: string[] = [];
        if(textSplit.length > 1) {
            tags = textSplit.slice(1, textSplit.length);
            if(tags.some((e) => !e.startsWith('#'))) {
                throw new ManagedError('INVALID_TAG', "The tags should start with `#` character")
            }
            tags = tags.map((e) => e.slice(1, e.length));
        }

        console.log("Detected tags: " + tags);

        // Create database
        const client = new Client({
            auth: user.token,
        });

        // Get title
        let title = '';
        /*try {
            console.log("Getting title of link")
            const response = await fetch(link);
            const html = await response.text();
            const $ = cheerioLoad(html);
            title = $('title').text();
        } catch(ex) {
            console.log("Unable to get title link")
        }*/


        console.log("Storing title: " + title)
        const createPageResponse = await client.pages.create({
            parent: {
                database_id: user.database!,
            },
            properties: {
                Name: {
                    type: 'title',
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ]
                },
                Link: {
                    type: 'url',
                    url: link
                },
                Tags: {
                    multi_select: tags.map((e) => ({ name: e }))
                },
            } 
        })
    }
}