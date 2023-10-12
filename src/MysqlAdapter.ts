import {DatabaseEngineAdapter} from "./DatabaseEngineAdapter";
import {Connection} from "mysql2/promise";

export class MysqlAdapter implements DatabaseEngineAdapter {
  private db: Connection;

  constructor({ client }: { client: Connection }) {
    this.db = client;
  }

  async executeQuery(query: string): Promise<unknown[]> {
    if (this.isSelectQuery(query)) {
      const [rows] = await this.db.query(query);
      return rows as unknown[];
    } else {
      await this.db.execute(query);
      return [];
    }
  }

  private isSelectQuery(query: string): boolean {
    return query.trim().toLowerCase().startsWith("select");
  }
}
