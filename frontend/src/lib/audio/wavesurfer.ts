import WaveSurfer from 'wavesurfer.js';

export interface WaveSurferConfig {
  container: HTMLElement | string;
  waveColor?: string;
  progressColor?: string;
  cursorColor?: string;
  barWidth?: number;
  barRadius?: number;
  height?: number;
  normalize?: boolean;
  responsive?: boolean;
}

// Brand colors from design system
const BRAND_COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  waveColor: '#667eea40', // 25% opacity
  progressColor: '#667eea',
  cursorColor: '#764ba2',
};

/**
 * Creates a WaveSurfer instance with default BeatPush styling
 */
export function createWaveSurfer(config: WaveSurferConfig): WaveSurfer {
  const defaultConfig: WaveSurferConfig = {
    waveColor: BRAND_COLORS.waveColor,
    progressColor: BRAND_COLORS.progressColor,
    cursorColor: BRAND_COLORS.cursorColor,
    barWidth: 2,
    barRadius: 3,
    height: 80,
    normalize: true,
    responsive: true,
    ...config,
  };

  return WaveSurfer.create(defaultConfig);
}

/**
 * Loads an audio file into a WaveSurfer instance
 */
export async function loadAudio(
  wavesurfer: WaveSurfer,
  url: string
): Promise<void> {
  try {
    await wavesurfer.load(url);
  } catch (error) {
    console.error('Failed to load audio:', error);
    throw new Error('Failed to load audio file');
  }
}

/**
 * Destroys a WaveSurfer instance and cleans up resources
 */
export function destroyWaveSurfer(wavesurfer: WaveSurfer | null): void {
  if (wavesurfer) {
    wavesurfer.destroy();
  }
}

/**
 * Formats time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export { WaveSurfer };
export type { WaveSurfer as WaveSurferInstance };
