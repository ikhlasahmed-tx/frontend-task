import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
import { RefreshToken } from "../models/RefreshToken";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Wallet, RefreshToken],
    synchronize: true
})