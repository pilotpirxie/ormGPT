export interface DatabaseEngineAdapter {
  executeQuery(query: string): Promise<any[]>;
}
