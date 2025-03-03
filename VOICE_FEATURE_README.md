# AGR Platform Voice Feature

## Overview

The AGR (Ancient Greece Revisited) platform includes a text-to-speech feature that enables philosophers to speak their responses. This document explains how the voice feature works, its current implementation, and the password protection mechanism.

## Password Protection

The voice feature is **disabled by default** and protected with a password to prevent accidental usage that might incur unnecessary API costs during development and demonstrations.

### Enabling Voice

To enable the voice feature:

1. Click the "Voice Off 🔒" button in the chat header
2. Enter the password when prompted: `agr-voice-on`
3. Upon successful authentication, the button will change to "Voice On" and voice responses will be enabled

### Disabling Voice

To disable the voice feature:
1. Simply click the "Voice On" button (no password required to turn it off)

## Technical Implementation

### How It Works

The voice feature uses the following components:

1. **ElevenLabs API**: Leverages the ElevenLabs API to generate high-quality, natural-sounding speech with unique voices for each philosopher.

2. **Text Processing**:
   - Splits long responses into manageable chunks
   - Removes action texts (texts within asterisks)
   - Ensures natural break points at sentence boundaries

3. **Audio Playback**:
   - `AudioPlayer.js`: For playing single audio segments
   - `SequentialAudioPlayer.js`: For playing multiple audio segments in sequence

### API Usage and Costs

**Important: ElevenLabs charges per character processed.**

- The current implementation uses the ElevenLabs API which charges per character processed.
- To manage costs during development and testing:
  - Voice feature is password-protected
  - Text is limited to 500 characters per chunk
  - Long responses are split into separate audio files

## Developer Notes

### Voice Customization

Each philosopher has a unique voice selected to match their character:

- **Socrates**: Reflective, questioning tone
- **Aristotle**: Clear, methodical voice
- **Plato**: Sophisticated, contemplative tone
- **Heraclitus**: Passionate, dramatic delivery
- **Pythagoras**: Precise, rhythmic speech patterns
- **Xenophon**: Practical, straightforward style

### Adding New Philosopher Voices

To add a new philosopher voice, you need to:

1. Create a voice clone in ElevenLabs
2. Add the voice ID to the configuration in the Netlify function
3. Update the philosopher mapping in the voice generation code

## Troubleshooting

Common issues and solutions:

- **No audio playing**: Check browser console for errors; may indicate API quota exceeded
- **Audio cuts off**: Long responses are split into chunks; check if all chunks loaded correctly
- **Poor voice quality**: Verify the ElevenLabs voice settings and ensure proper text formatting

## Security Considerations

- The password protection is a basic implementation intended to prevent accidental usage
- For production, consider implementing a more robust authentication system
- API keys are stored as environment variables in Netlify and never exposed client-side

## Future Improvements

Planned enhancements for the voice feature:

- Improved SSML support for better speech quality and inflection
- Voice caching to reduce API calls for common phrases
- User preferences for speech rate and volume
- Fallback to browser's built-in TTS if API is unavailable

---

For questions or issues, please contact the AGR development team.