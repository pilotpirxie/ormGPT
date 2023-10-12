import "dotenv/config";
import { ormGPT } from "../src";
import { SqliteAdapter } from "../src/SqliteAdapter";

(async () => {
  const sqliteAdapter = new SqliteAdapter({
    dbFilePath: "./example/db.sqlite",
  });

  const ormgpt = new ormGPT({
    apiKey: process.env.OPENAI_API_KEY || "",
    schemaFilePath: "./example/schema.sql",
    dialect: "postgres",
    dbEngineAdapter: sqliteAdapter,
  });

  await ormgpt.query(
    "add new user with id 1, username 'test' and email 'test@example.com'",
  );

  const users = await ormgpt.query("get all users");
  console.log(users);

  await ormgpt.query(
    "add new user with id 2, username 'test2' and email 'test2@example.com'"
  );

  await ormgpt.query(
    "add new post with id 1, title 'Hello world!' and content 'This is my first post!' as user with id 1"
  );

  await ormgpt.query(
    "add new post with id 2, title 'Hello world 2!' and content 'This is my second post!' as user with id 2"
  );

  await ormgpt.query(
    "add comment to post with id 1 with comment content 'Hello world!', comment id 1 and add as user with id 2"
  );

  const postQuery3 = await ormgpt.query(
    "give me post with id 1, all comments for this post and user information about author",
  );
  console.log(postQuery3);
})();
