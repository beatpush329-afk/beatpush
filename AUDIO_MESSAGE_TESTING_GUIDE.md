# Audio Message System - Testing Guide

## Overview
Phase 1 of the COMPLETE_ARCHITECTURE_ROADMAP has been implemented: **Audio Message System**

This guide covers how to test the new voice messaging feature end-to-end.

---

## Prerequisites

### Backend Requirements
1. **FFmpeg installed** on the Render server:
   ```bash
   # Render will need FFmpeg in the build environment
   # Add to render.yaml or install via buildpack
   ```

2. **Database migration applied**:
   ```bash
   cd backend
   alembic upgrade head  # Applies 009_add_audio_message_support.py
   ```

3. **Python dependencies installed**:
   ```bash
   pip install -r requirements.txt
   # Includes: pydub, ffmpeg-python
   ```

4. **Backend running**:
   ```bash
   uvicorn app.main:app --reload
   # Or deployed on Render: https://beatpush-c1gs.onrender.com
   ```

### Frontend Requirements
1. **Node modules installed**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment variables set**:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000  # or Render URL
   ```

3. **Frontend running**:
   ```bash
   npm run dev
   # Or deployed on Vercel (recommended)
   ```

---

## Test Scenarios

### 1. Recording Audio Message

**Steps:**
1. Navigate to `/messages` or any conversation
2. Click the microphone button (🎤)
3. Allow microphone permissions when prompted
4. Observe:
   - Red recording indicator appears
   - Timer starts (00:00 format)
   - Recording status visible

**Expected Results:**
- ✅ Microphone permission granted
- ✅ Recording indicator animates
- ✅ Timer counts up (MM:SS)
- ✅ Stop button (⏹) appears

**Validation:**
```javascript
// In browser console:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('✅ Microphone access granted'))
  .catch(err => console.error('❌ Microphone error:', err));
```

---

### 2. Stopping & Previewing Recording

**Steps:**
1. Record for 5-10 seconds
2. Click stop button (⏹)
3. Observe preview controls

**Expected Results:**
- ✅ Recording stops
- ✅ Duration displayed (e.g., "0:08")
- ✅ Send button (✉️) appears
- ✅ Delete button (🗑️) appears
- ✅ Timer stops

---

### 3. Sending Audio Message

**Steps:**
1. After recording, click send button (✉️)
2. Observe upload process

**Expected Results:**
- ✅ Loading indicator appears
- ✅ Message sent successfully
- ✅ Audio bubble appears in chat
- ✅ Message includes:
  - Play button
  - Waveform visualization
  - Duration display

**Backend Validation:**
Check backend logs for:
```
Processing audio message...
Audio compressed: 64kbps MP3
Duration: 8 seconds
Waveform generated: 100 peaks
Uploaded to: audio_messages/{user_id}/{uuid}.mp3
```

**Database Validation:**
```sql
SELECT 
  id, 
  content,
  audio_url,
  audio_duration,
  waveform_data->>'samples' as waveform_samples
FROM messages 
WHERE audio_url IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 1;
```

---

### 4. Playing Audio Message

**Steps:**
1. Find a sent audio message
2. Click play button (▶️)
3. Observe playback

**Expected Results:**
- ✅ Play button changes to pause (⏸)
- ✅ Waveform fills as audio plays
- ✅ Time updates in real-time
- ✅ Audio plays clearly
- ✅ Auto-stops at end

**Validation:**
```javascript
// Check waveform data in message object
console.log(message.waveform_data);
// Expected: { peaks: [0.1, 0.3, ...], duration: 8, samples: 100 }
```

---

### 5. Waveform Interaction

**Steps:**
1. Click anywhere on waveform during playback
2. Observe seek behavior

**Expected Results:**
- ✅ Playback jumps to clicked position
- ✅ Visual progress updates
- ✅ Audio continues from new position

---

### 6. Audio Compression & Quality

**Test Audio Sizes:**

| Input Format | Input Size | Output Size | Compression |
|--------------|-----------|-------------|-------------|
| webm (48kHz) | ~500KB    | ~60KB       | ~88% |
| wav (44kHz)  | ~800KB    | ~60KB       | ~92% |
| m4a          | ~200KB    | ~60KB       | ~70% |

**Steps:**
1. Record 60-second message
2. Send and check file size

**Expected Results:**
- ✅ Output is MP3 format
- ✅ Bitrate is 64kbps
- ✅ Mono channel
- ✅ File size ≈ 60KB per minute

**API Validation:**
```bash
# Check processed audio metadata
curl -X GET "http://localhost:8000/api/v1/messaging/messages/{message_id}/audio" \
  -H "Authorization: Bearer {token}"

# Expected response:
{
  "message_id": "...",
  "audio_url": "https://storage.../audio.mp3",
  "duration": 60,
  "waveform_data": {
    "peaks": [...],
    "duration": 60,
    "samples": 100
  }
}
```

---

### 7. Duration Limits

**Steps:**
1. Start recording
2. Let it run for 5+ minutes

**Expected Results:**
- ✅ Auto-stops at 5:00
- ✅ Error message if over limit
- ✅ Backend rejects >300 seconds

**API Test:**
```bash
# Try to send 6-minute audio (should fail)
curl -X POST "http://localhost:8000/api/v1/messaging/messages/audio?conversation_id={id}" \
  -H "Authorization: Bearer {token}" \
  -F "audio_file=@long_audio.webm"

# Expected: 400 Bad Request
# Error: "Audio duration (360s) exceeds maximum (300s)"
```

---

### 8. Deleting Audio Message

**Steps:**
1. Send an audio message
2. Click message options (⋮)
3. Select "Delete"
4. Confirm deletion

**Expected Results:**
- ✅ Confirmation prompt appears
- ✅ Audio file deleted from storage
- ✅ Message text changes to "[Audio message deleted]"
- ✅ Playback controls disappear

**API Test:**
```bash
curl -X DELETE "http://localhost:8000/api/v1/messaging/messages/{message_id}/audio" \
  -H "Authorization: Bearer {token}"

# Expected: 200 OK
# { "message": "Audio message deleted successfully" }
```

---

### 9. Error Handling

#### 9.1 Microphone Permission Denied
**Steps:** Deny microphone permission
**Expected:** Error message "Failed to access microphone"

#### 9.2 Upload Failure
**Steps:** Disconnect internet, try to send
**Expected:** Error message "Failed to send audio message"

#### 9.3 Invalid Format
**Steps:** Try to upload .txt file as audio
**Expected:** 400 error "Invalid audio file"

#### 9.4 File Too Large
**Steps:** Upload 15MB audio file
**Expected:** 400 error "Max size: 10MB"

---

### 10. Cross-Browser Testing

Test in multiple browsers:
- ✅ Chrome (webm codec)
- ✅ Firefox (webm codec)
- ✅ Safari (m4a codec may differ)
- ✅ Edge (webm codec)

**Known Issues:**
- Safari may use different MediaRecorder codec
- iOS may require user interaction before recording

---

## API Endpoints Reference

### Send Audio Message
```http
POST /api/v1/messaging/messages/audio?conversation_id={id}
Content-Type: multipart/form-data

audio_file: <Blob>
```

**Response:**
```json
{
  "id": "msg_123",
  "conversation_id": "conv_456",
  "sender_id": "user_789",
  "content": "[Audio Message]",
  "audio_url": "https://storage.../audio.mp3",
  "audio_duration": 8,
  "waveform_data": {
    "peaks": [0.1, 0.3, 0.5, ...],
    "duration": 8,
    "samples": 100
  },
  "created_at": "2026-09-03T10:30:00Z"
}
```

### Get Audio Message
```http
GET /api/v1/messaging/messages/{message_id}/audio
Authorization: Bearer {token}
```

### Delete Audio Message
```http
DELETE /api/v1/messaging/messages/{message_id}/audio
Authorization: Bearer {token}
```

---

## Performance Benchmarks

**Target Performance:**
- Recording start: <500ms
- Audio compression: <2s per minute
- Waveform generation: <1s
- Upload: <3s per minute (depends on network)
- Playback start: <200ms

**Monitor in DevTools:**
```javascript
// Frontend timing
console.time('audio-send');
await messagingService.sendAudioMessage(conversationId, audioBlob);
console.timeEnd('audio-send');
// Expected: 2-5 seconds total
```

---

## Troubleshooting

### Backend Issues

**Problem:** FFmpeg not found
```
Error: FileNotFoundError: [Errno 2] No such file or directory: 'ffmpeg'
```
**Solution:** Install FFmpeg on server
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Render: Add buildpack or use Docker with FFmpeg
```

**Problem:** Audio compression fails
```
Error: FFmpeg error: [error details]
```
**Solution:** Check FFmpeg version and codecs
```bash
ffmpeg -version
ffmpeg -codecs | grep mp3
```

### Frontend Issues

**Problem:** Microphone not accessible
**Solution:** 
- Check HTTPS (required for getUserMedia)
- Check browser permissions
- Try different browser

**Problem:** Waveform not rendering
**Solution:**
- Check canvas support
- Check waveform_data in message object
- Inspect browser console for errors

---

## Success Criteria

✅ **Audio Message System is working if:**

1. User can record audio messages
2. Audio compresses to MP3 <100KB/min
3. Waveform generates 100 peaks
4. Messages display with playback controls
5. Clicking waveform seeks correctly
6. Duration displays accurately
7. Messages deletable by sender
8. All audio files upload to storage
9. No memory leaks during recording
10. Cross-browser compatible

---

## Next Steps

After testing passes:

1. ✅ Mark Task #9 complete
2. ✅ Deploy backend to Render (apply migration)
3. ✅ Deploy frontend to Vercel
4. ✅ Move to Phase 1 Task 2: Smart Licensing System
5. ✅ Continue with COMPLETE_ARCHITECTURE_ROADMAP

---

## Resources

- **FFmpeg Docs**: https://ffmpeg.org/documentation.html
- **MediaRecorder API**: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
- **WebAudio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Canvas Waveform**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

---

**Created:** 2026-09-03  
**Status:** Ready for Testing  
**Phase:** 1 - Audio Message System  
**Next:** Deploy & Test End-to-End
