import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import {
  Document,
  HuggingFaceEmbedding,
  Ollama,
  Settings,
  VectorStoreIndex,
} from "llamaindex";

// Verwende die externe URL deiner Ollama-Instanz über eine Umgebungsvariable
const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "https://llm-provider.cycg.app";

const ollama = new Ollama({
    model: process.env.OLAMA_MODEL || 'mixtral:8x7b',
    host: process.env.OLAMA_HOST || 'https://llm-provider.cycg.app', // Externe URL deiner Ollama-Instanz
  } as any);

  // Setze die LLM- und Embed-Modelle in den Einstellungen
  Settings.llm = ollama;
Settings.embedModel = new HuggingFaceEmbedding({
  modelType: "BAAI/bge-small-en-v1.5",
  quantized: false,
});

export async function GET(): Promise<NextResponse> {
  try {
    // Load essay from abramov.txt in Node
    const path = "node_modules/llamaindex/examples/abramov.txt";
    const essay = await fs.readFile(path, "utf-8");

    // Create Document object with essay
    const document = new Document({ text: essay, id_: path });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const index = await VectorStoreIndex.fromDocuments([document]);

    // Hardcoded query
    const query = "What did the author do in college?";

    // Query the index
    const queryEngine = index.asQueryEngine();
    const response = await queryEngine.query({ query });

    // Return response as JSON
    return NextResponse.json({ response: response.toString() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
