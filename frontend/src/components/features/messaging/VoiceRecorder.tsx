'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => Promise<void>;
  onCancel?: () => void;
  maxDuration?: number; // seconds
  className?: string;
}

export function VoiceRecorder({
  onSend,
  onCancel,
  maxDuration = 300, // 5 minutes default
  className
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stopStream();
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          
          // Auto-stop at max duration
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          
          return newDuration;
        });
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Stop media stream
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Cancel recording
  const handleCancel = () => {
    stopRecording();
    setAudioBlob(null);
    setDuration(0);
    chunksRef.current = [];
    onCancel?.();
  };

  // Send recording
  const handleSend = async () => {
    if (!audioBlob) return;

    try {
      setIsSending(true);
      await onSend(audioBlob);
      
      // Reset state
      setAudioBlob(null);
      setDuration(0);
      chunksRef.current = [];
      
    } catch (err) {
      console.error('Error sending audio:', err);
      setError('Failed to send audio message');
    } finally {
      setIsSending(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopStream();
    };
  }, []);

  return (
    <div className={cn('flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg', className)}>
      {error && (
        <div className="text-sm text-red-500 flex-1">
          {error}
        </div>
      )}

      {!error && (
        <>
          {/* Duration Display */}
          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-mono text-red-500">
                  {formatDuration(duration)}
                </span>
              </div>
            )}

            {audioBlob && !isRecording && (
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {formatDuration(duration)}
              </span>
            )}
          </div>

          {/* Recording Controls */}
          {!audioBlob && (
            <>
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="icon"
                  variant="default"
                  className="rounded-full bg-red-500 hover:bg-red-600"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="icon"
                  variant="destructive"
                  className="rounded-full"
                >
                  <Square className="h-5 w-5" />
                </Button>
              )}
            </>
          )}

          {/* Preview Controls */}
          {audioBlob && !isRecording && (
            <>
              <Button
                onClick={handleCancel}
                size="icon"
                variant="ghost"
                className="rounded-full"
                disabled={isSending}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>

              <Button
                onClick={handleSend}
                size="icon"
                variant="default"
                className="rounded-full bg-green-500 hover:bg-green-600"
                disabled={isSending}
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </>
          )}

          {/* Cancel while recording */}
          {isRecording && (
            <Button
              onClick={handleCancel}
              size="sm"
              variant="ghost"
              className="ml-auto"
            >
              Cancel
            </Button>
          )}
        </>
      )}
    </div>
  );
}
