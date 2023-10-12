import 'dotenv/config';
import {ormGPT} from "../src";


(async () => {
  const ormgpt = new ormGPT({
    apiKey: process.env.OPENAI_API_KEY || "",
    schemaFilePath: "./example/schema.sql",
    dialect: "postgres",
  });

  const userQuery = await ormgpt.getQuery("give me all users data");
  console.log(userQuery);

  const userQuery2 = await ormgpt.getQuery("give me all users data where id is 1");
  console.log(userQuery2);

  const postQuery1 = await ormgpt.getQuery("give me all posts for user with id 1");
  console.log(postQuery1);

  const postQuery2 = await ormgpt.getQuery(
    "give me post with id 1 and all comments for it",
  );
  console.log(postQuery2);

  const postQuery3 = await ormgpt.getQuery(
    "give me post with id 1, all comments for this post and user information about author",
  );
  console.log(postQuery3);

  const commentQuery = await ormgpt.getQuery(
    "give me all comments written between 2023-01-01 and 2023-12-01",
  );
  console.log(commentQuery);

  const commentQuery2 = await ormgpt.getQuery(
    "add a comment for post with id 1 with content 'Hello world!' as user with id 3",
  );
  console.log(commentQuery2);

  const userQuery3 = await ormgpt.getQuery(
    "add new user with username 'test' and email 'test@example.com'",
  );
  console.log(userQuery3);

  const userQuery4 = await ormgpt.getQuery(
    "write batch insert of 10 users with username 'test'+current_index and email 'test+current_index@example.com'",
  );
  console.log(userQuery4);
})();
