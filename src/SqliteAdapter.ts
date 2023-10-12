import { DatabaseEngineAdapter } from "./DatabaseEngineAdapter";
import betterSqlite3, { Statement } from "better-sqlite3";

export class SqliteAdapter implements DatabaseEngineAdapter {
  private db: betterSqlite3.Database;

  constructor({ dbFilePath }: { dbFilePath: string }) {
    this.db = new betterSqlite3(dbFilePath);
  }

  executeQuery(query: string): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
      const statement: Statement = this.db.prepare(query);
      if (this.isSelectQuery(query)) {
        resolve(statement.all());
      } else {
        const info = statement.run();
        resolve([]);
      }
    });
  }

  private isSelectQuery(query: string): boolean {
    return query.trim().toLowerCase().startsWith("select");
  }
}
