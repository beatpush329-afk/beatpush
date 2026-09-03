"""
Audio Processing Service for Voice Messages
Handles audio compression, waveform generation, and duration extraction
"""
import io
import json
import wave
import struct
from typing import Dict, Optional, Tuple, BinaryIO
from pathlib import Path
import tempfile
import subprocess
import os

from app.core.config import settings


class AudioProcessingService:
    """Service for processing audio files for messaging"""
    
    SUPPORTED_FORMATS = ['mp3', 'wav', 'ogg', 'm4a', 'webm']
    MAX_DURATION_SECONDS = 300  # 5 minutes max
    TARGET_BITRATE = '64k'  # Good quality for voice
    TARGET_FORMAT = 'mp3'
    WAVEFORM_SAMPLES = 100  # Number of samples for waveform visualization
    
    @staticmethod
    def extract_duration(audio_data: bytes, format: str = 'mp3') -> int:
        """
        Extract duration from audio file in seconds
        
        Args:
            audio_data: Raw audio file bytes
            format: Audio format (mp3, wav, etc.)
            
        Returns:
            Duration in seconds
        """
        try:
            # Write to temp file
            with tempfile.NamedTemporaryFile(suffix=f'.{format}', delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_path = temp_file.name
            
            try:
                # Use ffprobe to get duration
                result = subprocess.run(
                    [
                        'ffprobe',
                        '-v', 'error',
                        '-show_entries', 'format=duration',
                        '-of', 'default=noprint_wrappers=1:nokey=1',
                        temp_path
                    ],
                    capture_output=True,
                    text=True,
                    check=True
                )
                
                duration = float(result.stdout.strip())
                return int(duration)
                
            finally:
                # Clean up temp file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                    
        except Exception as e:
            print(f"Error extracting duration: {str(e)}")
            return 0
    
    @staticmethod
    def compress_audio(
        audio_data: bytes,
        input_format: str = 'webm',
        quality: str = TARGET_BITRATE
    ) -> Tuple[bytes, str]:
        """
        Compress audio to MP3 format
        
        Args:
            audio_data: Raw audio file bytes
            input_format: Input audio format
            quality: Target bitrate (e.g., '64k', '128k')
            
        Returns:
            Tuple of (compressed_data, output_format)
        """
        try:
            # Write input to temp file
            with tempfile.NamedTemporaryFile(suffix=f'.{input_format}', delete=False) as input_file:
                input_file.write(audio_data)
                input_path = input_file.name
            
            # Create output temp file
            output_path = tempfile.mktemp(suffix='.mp3')
            
            try:
                # Use ffmpeg to compress
                subprocess.run(
                    [
                        'ffmpeg',
                        '-i', input_path,
                        '-vn',  # No video
                        '-ar', '44100',  # Audio sampling rate
                        '-ac', '1',  # Mono
                        '-b:a', quality,  # Bitrate
                        '-f', 'mp3',
                        output_path
                    ],
                    capture_output=True,
                    check=True
                )
                
                # Read compressed file
                with open(output_path, 'rb') as f:
                    compressed_data = f.read()
                
                return compressed_data, 'mp3'
                
            finally:
                # Clean up temp files
                if os.path.exists(input_path):
                    os.unlink(input_path)
                if os.path.exists(output_path):
                    os.unlink(output_path)
                    
        except subprocess.CalledProcessError as e:
            print(f"FFmpeg error: {e.stderr.decode() if e.stderr else str(e)}")
            # Return original if compression fails
            return audio_data, input_format
        except Exception as e:
            print(f"Error compressing audio: {str(e)}")
            return audio_data, input_format
    
    @staticmethod
    def generate_waveform(audio_data: bytes, format: str = 'mp3') -> Dict:
        """
        Generate waveform data for visualization
        
        Args:
            audio_data: Raw audio file bytes
            format: Audio format
            
        Returns:
            Dict with waveform data: {peaks: List[float], duration: int}
        """
        try:
            # Convert to WAV first for easier processing
            with tempfile.NamedTemporaryFile(suffix=f'.{format}', delete=False) as input_file:
                input_file.write(audio_data)
                input_path = input_file.name
            
            wav_path = tempfile.mktemp(suffix='.wav')
            
            try:
                # Convert to WAV
                subprocess.run(
                    [
                        'ffmpeg',
                        '-i', input_path,
                        '-ar', '8000',  # Lower sample rate for analysis
                        '-ac', '1',  # Mono
                        '-f', 'wav',
                        wav_path
                    ],
                    capture_output=True,
                    check=True
                )
                
                # Read WAV file
                with wave.open(wav_path, 'rb') as wav_file:
                    frames = wav_file.readframes(wav_file.getnframes())
                    sample_width = wav_file.getsampwidth()
                    frame_rate = wav_file.getframerate()
                    n_frames = wav_file.getnframes()
                    
                    # Convert bytes to samples
                    if sample_width == 1:
                        fmt = f'{n_frames}B'
                        samples = struct.unpack(fmt, frames)
                        samples = [s - 128 for s in samples]
                    elif sample_width == 2:
                        fmt = f'{n_frames}h'
                        samples = struct.unpack(fmt, frames)
                    else:
                        raise ValueError(f"Unsupported sample width: {sample_width}")
                    
                    # Generate peaks by downsampling
                    chunk_size = len(samples) // AudioProcessingService.WAVEFORM_SAMPLES
                    if chunk_size == 0:
                        chunk_size = 1
                    
                    peaks = []
                    for i in range(0, len(samples), chunk_size):
                        chunk = samples[i:i + chunk_size]
                        if chunk:
                            # Get max absolute value in chunk (peak)
                            peak = max(abs(s) for s in chunk)
                            # Normalize to 0-1 range
                            normalized = peak / 32768.0 if sample_width == 2 else peak / 128.0
                            peaks.append(round(normalized, 3))
                    
                    # Ensure we have exactly WAVEFORM_SAMPLES peaks
                    if len(peaks) > AudioProcessingService.WAVEFORM_SAMPLES:
                        peaks = peaks[:AudioProcessingService.WAVEFORM_SAMPLES]
                    elif len(peaks) < AudioProcessingService.WAVEFORM_SAMPLES:
                        peaks.extend([0.0] * (AudioProcessingService.WAVEFORM_SAMPLES - len(peaks)))
                    
                    duration = n_frames / frame_rate
                    
                    return {
                        'peaks': peaks,
                        'duration': int(duration),
                        'samples': AudioProcessingService.WAVEFORM_SAMPLES
                    }
                    
            finally:
                if os.path.exists(input_path):
                    os.unlink(input_path)
                if os.path.exists(wav_path):
                    os.unlink(wav_path)
                    
        except Exception as e:
            print(f"Error generating waveform: {str(e)}")
            # Return empty waveform on error
            return {
                'peaks': [0.0] * AudioProcessingService.WAVEFORM_SAMPLES,
                'duration': 0,
                'samples': AudioProcessingService.WAVEFORM_SAMPLES
            }
    
    @staticmethod
    def process_audio_message(
        audio_data: bytes,
        input_format: str = 'webm'
    ) -> Dict:
        """
        Process audio message: compress, extract duration, generate waveform
        
        Args:
            audio_data: Raw audio file bytes
            input_format: Input audio format
            
        Returns:
            Dict with processed audio data:
            {
                'compressed_data': bytes,
                'format': str,
                'duration': int,
                'waveform': Dict,
                'size': int
            }
        """
        # Compress audio
        compressed_data, output_format = AudioProcessingService.compress_audio(
            audio_data,
            input_format
        )
        
        # Extract duration
        duration = AudioProcessingService.extract_duration(compressed_data, output_format)
        
        # Check duration limit
        if duration > AudioProcessingService.MAX_DURATION_SECONDS:
            raise ValueError(
                f"Audio duration ({duration}s) exceeds maximum "
                f"({AudioProcessingService.MAX_DURATION_SECONDS}s)"
            )
        
        # Generate waveform
        waveform = AudioProcessingService.generate_waveform(compressed_data, output_format)
        
        return {
            'compressed_data': compressed_data,
            'format': output_format,
            'duration': duration,
            'waveform': waveform,
            'size': len(compressed_data)
        }
    
    @staticmethod
    def validate_audio_file(audio_data: bytes, format: str) -> bool:
        """
        Validate audio file format and size
        
        Args:
            audio_data: Raw audio file bytes
            format: Audio format
            
        Returns:
            True if valid, False otherwise
        """
        # Check format
        if format.lower() not in AudioProcessingService.SUPPORTED_FORMATS:
            return False
        
        # Check size (max 10MB for voice messages)
        if len(audio_data) > 10 * 1024 * 1024:
            return False
        
        return True


# Create singleton instance
audio_service = AudioProcessingService()
