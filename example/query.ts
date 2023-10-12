import "dotenv/config";
import { ormGPT } from "../src";
import { SqliteAdapter } from "../src/SqliteAdapter";

(async () => {
  const sqliteAdapter = new SqliteAdapter({
    dbFilePath: "./example/db.sqlite",
  });

  const ormgpt = new ormGPT({
    apiKey: "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",
    schemaFilePath: "./example/schema.sql",
    dialect: "postgres",
    dbEngineAdapter: sqliteAdapter,
  });

  await ormgpt.query(
    "add new user with username 'test' and email 'test@example.com'",
  );

  const users = await ormgpt.query("get all users");
  console.log(users);
})();
