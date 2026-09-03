'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AudioWaveformProps {
  peaks: number[];
  progress: number; // 0-100
  onSeek?: (position: number) => void;
  isPlaying?: boolean;
  className?: string;
  height?: number;
  barWidth?: number;
  barGap?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export function AudioWaveform({
  peaks,
  progress,
  onSeek,
  isPlaying = false,
  className,
  height = 40,
  barWidth = 3,
  barGap = 2,
  activeColor = '#3b82f6', // blue-500
  inactiveColor = '#d1d5db' // gray-300
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, height);

    // Calculate bar count
    const totalBarWidth = barWidth + barGap;
    const barCount = Math.min(peaks.length, Math.floor(rect.width / totalBarWidth));
    
    // Calculate progress position
    const progressPosition = (progress / 100) * rect.width;

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const index = Math.floor((i / barCount) * peaks.length);
      const peak = peaks[index] || 0;
      
      // Calculate bar height (normalized peak 0-1)
      const barHeight = Math.max(2, peak * height * 0.9);
      const x = i * totalBarWidth;
      const y = (height - barHeight) / 2;

      // Determine color based on progress
      ctx.fillStyle = x <= progressPosition ? activeColor : inactiveColor;
      
      // Draw bar with rounded corners
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      ctx.fill();
    }
  }, [peaks, progress, height, barWidth, barGap, activeColor, inactiveColor]);

  // Handle click to seek
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    onSeek(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative cursor-pointer select-none',
        isPlaying && 'animate-pulse',
        className
      )}
      onClick={handleClick}
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
