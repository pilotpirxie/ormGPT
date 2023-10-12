import "dotenv/config";
import { ormGPT } from "../src";
import {createConnection} from "mysql2/promise";
import {MysqlAdapter} from "../src/MysqlAdapter";

(async () => {
  const client = await createConnection({
    host: 'localhost',
    port: 3306,
    database: 'ormgpt',
    user: 'root',
    password: 'mysecretpassword',
  });

  const mysqlAdapter = new MysqlAdapter({
    client
  });

  const ormgpt = new ormGPT({
    apiKey: process.env.OPENAI_API_KEY || "",
    schemaFilePath: "./example/schema.sql",
    dialect: "postgres",
    dbEngineAdapter: mysqlAdapter,
  });

  await ormgpt.query(
    "add new user with username 'test' and email 'test@example.com'",
  );

  const users = await ormgpt.query("get all users");
  console.log(users);

  client.end();
})();
