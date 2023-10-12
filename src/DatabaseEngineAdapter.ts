export interface DatabaseEngineAdapter {
  executeQuery(query: string): any[];
}
