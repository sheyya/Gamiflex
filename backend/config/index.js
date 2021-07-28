
import dotenv from "dotenv";
dotenv.config();

export const DB = process.env.APP_DB;
export const PORT = process.env.APP_PORT;
export const SECRET = process.env.APP_SECRET;