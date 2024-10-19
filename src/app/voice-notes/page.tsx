'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, RotateCcw, Send } from "lucide-react";
import { transcribeAudio } from '@/actions/transcribeAudio';
import { sendEmail } from '@/actions/sendEmail';

export default function Component() {
    const [isRecording, setIsRecording] = useState(false);
    const [processedText, setProcessedText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const maxRecordingTime = 30; // Maximale Aufnahmezeit in Sekunden

    const contacts = [
        { name: 'Kai', email: 'kai@cycg.de' },
    ];

    const handleRecord = () => {
        console.log('Recording toggled:', !isRecording);
        setIsRecording(!isRecording);
        setProcessedText('');
        if (!isRecording) {
            setIsProcessing(true); // Setze isProcessing auf true  
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    console.log('Media stream obtained');
                    const mediaRecorder = new MediaRecorder(stream, {
                        mimeType: 'audio/webm' // Beispiel für einen effizienten MIME-Typ
                    });
                    let audioChunks: BlobPart[] = [];

                    mediaRecorder.ondataavailable = event => {
                        console.log('Data available:', event.data);
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.start();
                    console.log('Recording started');

                    setTimeout(() => {
                        mediaRecorder.stop();
                        console.log('Recording stopped after max time');
                    }, maxRecordingTime * 1000);

                    const interval = setInterval(() => {
                        setRecordingTime((prevTime) => {
                            if (prevTime >= maxRecordingTime) {
                                clearInterval(interval);
                                mediaRecorder.stop();
                                return prevTime;
                            }
                            return prevTime + 1;
                        });
                    }, 1000);

                    mediaRecorder.onstop = async () => {
                        clearInterval(interval);
                        setRecordingTime(0); // Zurücksetzen der Aufnahmezeit
                        console.log('MediaRecorder stopped');
                        setIsProcessing(true); // Setze isProcessing auf true
                        console.log('isProcessing gesetzt auf true');
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        setAudioBlob(audioBlob);

                        // Verwende FileReader, um den Blob in ein ArrayBuffer zu konvertieren
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                            const arrayBuffer = reader.result as ArrayBuffer;
                            const uint8Array = new Uint8Array(arrayBuffer);

                            try {
                                console.log('Sending audio to API for transcription');
                                const response = await fetch('/api/transcribe', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ audioData: Array.from(uint8Array) }),
                                });

                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }

                                const data = await response.json();
                                setProcessedText(data.transcription);
                                console.log('Transcription successful:', data.transcription);
                            } catch (error) {
                                console.error('Error in transcription:', error);
                                setProcessedText('Error in transcription');
                            } finally {
                                setIsProcessing(false); // Setze isProcessing auf false
                                console.log('isProcessing gesetzt auf false');
                            }
                        };
                        reader.readAsArrayBuffer(audioBlob);
                    };

                })
                .catch(error => {
                    console.error('Error accessing media devices:', error);
                });
        } else {
            // Stop recording manually
            setRecordingTime(0); // Reset recording time
            setIsRecording(false);
        }
    };

    const handleSend = async (email: string) => {
        setIsSending(true);
        try {
            // Verwende die Server Action zum Senden der E-Mail mit Anhang
            if (audioBlob) {
                await sendEmail(email, 'Processed Audio Transcription', processedText);
                alert(`Email sent to ${email}`);
            }
        } catch (error) {
            alert('Error sending email');
        } finally {
            setIsSending(false);
        }
    };


    return (
        <Card className="w-full max-w-md mx-auto p-4 space-y-4">
            <div className="flex justify-center">
                <Button
                    className={`w-32 h-32 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    onClick={handleRecord}
                >
                    {isRecording ? (
                        <Square className="w-16 h-16" />
                    ) : processedText ? (
                        <RotateCcw className="w-16 h-16" />
                    ) : (
                        <Mic className="w-16 h-16" />
                    )}
                </Button>
            </div>

            {isRecording && (
                <div className="text-center mt-2">
                    Aufnahmezeit: {recordingTime} / {maxRecordingTime} Sekunden
                </div>
            )}

            {isProcessing && (
                <div className="flex justify-center">
                    <div className="">Laden...</div>
                </div>
            )}

            {processedText && (
                <div className="border border-neutral-500 p-3 rounded-lg">
                    <h3 className="font-semibold mb-2">Text:</h3>
                    <p>{processedText}</p>
                </div>
            )}

            {processedText && (
                <div>
                    <h3 className="font-semibold mb-2">Send to:</h3>
                    <div className="flex flex-wrap gap-2">
                        {contacts.map((contact) => (
                            <Button
                                key={contact.email}
                                variant="outline"
                                className="rounded-full"
                                onClick={() => handleSend(contact.email)}
                                disabled={isSending}
                            >
                                {contact.name} <Send className="w-4 h-4 ml-2" />
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
