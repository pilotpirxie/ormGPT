import "dotenv/config";
import { ormGPT } from "../src";
import { SqliteAdapter } from "../src/SqliteAdapter";
import { Client } from 'pg'
import {PostgresAdapter} from "../src/PostgresAdapter";

(async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'ormgpt',
    user: 'mysecretuser',
    password: 'mysecretpassword',
  });
  await client.connect()

  const postgresAdapter = new PostgresAdapter({
    client
  });

  const ormgpt = new ormGPT({
    apiKey: process.env.OPENAI_API_KEY || "",
    schemaFilePath: "./example/schema.sql",
    dialect: "postgres",
    dbEngineAdapter: postgresAdapter,
  });

  await ormgpt.query(
    "add new user with username 'test' and email 'test@example.com'",
  );

  const users = await ormgpt.query("get all users");
  console.log(users);
})();
