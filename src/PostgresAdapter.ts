import { DatabaseEngineAdapter } from "./DatabaseEngineAdapter";
import {Client} from "pg";

export class PostgresAdapter implements DatabaseEngineAdapter {
  private db: Client;

  constructor({ client }: { client: Client }) {
    this.db = client;
  }

  async executeQuery(query: string): Promise<unknown[]> {
    if (this.isSelectQuery(query)) {
      const res = await this.db.query(query);
      return res.rows;
    } else {
      await this.db.query(query);
      return [];
    }
  }

  private isSelectQuery(query: string): boolean {
    return query.trim().toLowerCase().startsWith("select");
  }
}
