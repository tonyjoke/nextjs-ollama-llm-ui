import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/actions/transcribeAudio';

export async function POST(req: NextRequest) {
  try {
    const { audioData } = await req.json();
    const buffer = Buffer.from(audioData);
    const transcriptionText = await transcribeAudio(buffer);
    return NextResponse.json({ transcription: transcriptionText });
  } catch (error) {
    console.error('Error in transcription:', error);
    return NextResponse.json({ error: 'Error in transcription' }, { status: 500 });
  }
}