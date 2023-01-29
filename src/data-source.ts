import "reflect-metadata"
import { DataSource } from "typeorm";
import { User } from "./entities";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.STORAGE_PATH!,
    logging: true,
    synchronize: process.env.ENVIRONMENT === 'dev',
    entities: [User],
    subscribers: [],
    migrations: [],
})
