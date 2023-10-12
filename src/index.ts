import fs from "fs";
import path from "path";
import {ErrorResponse} from "./ErrorResponse";
import {SuccessResponse} from "./SuccessResponse";
import {DatabaseEngineAdapter} from "./DatabaseEngineAdapter";
import {ModelTuning} from "./ModelTuning";

export class ormGPT {
  private apiKey: string;
  private apiUrl: string = "https://api.openai.com/v1/chat/completions";
  private dbSchema: string;
  private dialect: string;
  private dbEngineAdapter?: DatabaseEngineAdapter;
  private model: string = "gpt-3.5-turbo";
  private modelOptions: ModelTuning = {
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }

  constructor({
    apiKey,
    dialect,
    schemaFilePath,
    dbEngineAdapter,
    apiUrl,
    model,
    modelOptions
  } : {
    apiKey: string;
    schemaFilePath: string;
    dialect: "postgres" | "mysql" | "sqlite";
    dbEngineAdapter?: DatabaseEngineAdapter;
    apiUrl?: string;
    model?: string;
    modelOptions?: ModelTuning;
  }) {
    this.apiKey = apiKey;
    this.dbSchema = fs.readFileSync(path.resolve(schemaFilePath), "utf-8");
    this.dialect = dialect;
    this.dbEngineAdapter = dbEngineAdapter;

    if (apiUrl) {
      this.apiUrl = apiUrl;
    }
    if (model) {
      this.model = model;
    }
    if (modelOptions) {
      this.modelOptions = modelOptions;
    }
  }

  private async getResponse(request: string): Promise<string> {
    const prompt = `
                You are an SQL engine brain. 
                You are using ${this.dialect} dialect.
                Having db schema as follows:
                ${this.dbSchema}
                
                Write a query to fulfil the user request: ${request}
                
                Don't write anything else than SQL query.
            `;

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        ...this.modelOptions,
      }),
    });

    const data = (await response.json()) as ErrorResponse | SuccessResponse;

    if (data.hasOwnProperty("error")) {
      throw new Error((data as ErrorResponse).error.message);
    }

    return (data as SuccessResponse).choices[0].message.content;
  }

  public async getQuery(request: string): Promise<string> {
    try {
      return await this.getResponse(request);
    } catch (error) {
      console.error("Error when generating query", request);
      throw error;
    }
  }

  public async query(request: string): Promise<any[]> {
    try {
      if (!this.dbEngineAdapter) {
        throw new Error("No dbEngineAdapter provided");
      }

      const query = await this.getQuery(request);
      console.log("Executing query", query);
      return this.dbEngineAdapter.executeQuery(query);
    } catch (error) {
      console.error("Error when executing query", request);
      throw error;
    }
  }
}
