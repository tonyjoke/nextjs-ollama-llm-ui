import fs from 'fs';
import fsPromises from 'fs/promises'; // Verwenden Sie das asynchrone fs-Modul
import os from 'os';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Verwendet den API-Schlüssel aus der Umgebungsvariable
  });
  
export async function transcribeAudio(buffer: Buffer) {
  // Verwende den temporären Ordner des Betriebssystems
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, 'audio.mp3');

  try {
    await fsPromises.writeFile(filePath, buffer); // Asynchrones Schreiben
    console.log(`File saved at: ${filePath}`);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath), // Verwenden Sie fs für createReadStream
      model: "whisper-1",
      response_format: "text",
    });

    console.log('Transcription successful:', transcription);
    return transcription;
  } catch (error) {
    console.error('Error during transcription:', error);
    throw new Error('Failed to transcribe audio');
  } finally {
    try {
      await fsPromises.unlink(filePath); // Asynchrones Löschen
    } catch (error) {
      console.error('Error deleting temporary file:', error);
    }
  }
}