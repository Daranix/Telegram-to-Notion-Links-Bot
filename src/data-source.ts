import "reflect-metadata"
import { DataSource } from "typeorm";
import { User } from "./entities";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./.db/store.db",
    logging: true,
    synchronize: true,
    entities: [User],
    subscribers: [],
    migrations: [],
    
})
