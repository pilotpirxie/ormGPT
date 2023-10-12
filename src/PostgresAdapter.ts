import { DatabaseEngineAdapter } from "./DatabaseEngineAdapter";
import {Client, Pool} from "pg";

export class PostgresAdapter implements DatabaseEngineAdapter {
  private db: Client;

  constructor({ client }: { client: Client }) {
    this.db = client;
  }

  async executeQuery(query: string): Promise<unknown[]> {
    const res = await this.db.query(query);
    return res.rows;
  }
}
