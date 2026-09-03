'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AudioWaveform } from './AudioWaveform';

interface AudioPlayerProps {
  audioUrl: string;
  duration: number; // seconds
  waveformData?: {
    peaks: number[];
    duration: number;
    samples: number;
  };
  className?: string;
  compact?: boolean;
}

export function AudioPlayer({
  audioUrl,
  duration,
  waveformData,
  className,
  compact = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Event listeners
    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);

  // Toggle play/pause
  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        // Pause
        audioRef.current.pause();
        setIsPlaying(false);
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      } else {
        // Play
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);

        // Start progress tracking
        progressIntervalRef.current = setInterval(() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }, 100);
      }
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio');
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  // Seek to position
  const handleSeek = (position: number) => {
    if (!audioRef.current) return;
    
    const newTime = (position / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-red-500', className)}>
        {error}
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          onClick={togglePlay}
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono min-w-[40px]">
          {formatTime(currentTime || 0)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg', className)}>
      {/* Play/Pause Button */}
      <Button
        onClick={togglePlay}
        size="icon"
        variant="ghost"
        className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>

      {/* Waveform or Progress Bar */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {waveformData ? (
          <AudioWaveform
            peaks={waveformData.peaks}
            progress={progress}
            onSeek={handleSeek}
            isPlaying={isPlaying}
          />
        ) : (
          <div
            className="h-10 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer relative overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = (x / rect.width) * 100;
              handleSeek(percentage);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Time Display */}
      <div className="flex flex-col items-end text-xs text-gray-600 dark:text-gray-400 font-mono min-w-[50px]">
        <span>{formatTime(currentTime || 0)}</span>
        <span className="text-gray-400 dark:text-gray-500">
          / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
