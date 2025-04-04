# streamscribe/transcriber.py

import os
import time
import whisper
import subprocess
import yt_dlp
from pydub import AudioSegment
from tempfile import NamedTemporaryFile

CHUNK_DURATION = 30

class YouTubeTranscriber:
    def __init__(self, url, model_size="base", chunk_duration=30, output_path="transcription_results.txt"):
        self.url = url
        self.model = whisper.load_model(model_size)
        self.chunk_duration = chunk_duration
        self.output_path = output_path
        self.temp_dir = "temp_audio"
        os.makedirs(self.temp_dir, exist_ok=True)

    def download_audio_file(self):
        out_path = os.path.join(self.temp_dir, "yt_audio.%(ext)s")
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': out_path,
            'quiet': True,
            'no_warnings': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'wav',
                'preferredquality': '192',
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(self.url, download=True)
            return out_path.replace("%(ext)s", "wav")

    def transcribe(self):
        audio_path = self.download_audio_file()
        audio = AudioSegment.from_wav(audio_path)
        duration = len(audio) // 1000

        transcription_output = []

        for start in range(0, duration, self.chunk_duration):
            end = min(start + self.chunk_duration, duration)
            chunk = audio[start * 1000:end * 1000]
            chunk_file = os.path.join(self.temp_dir, f"chunk_{start}_{end}.wav")
            chunk.export(chunk_file, format="wav")

            try:
                result = self.model.transcribe(chunk_file, task="translate")
                text = result["text"].strip()
                print(f"🗣️ [{start}s–{end}s]: {text}")
                transcription_output.append(text)
            except Exception as e:
                print(f"❌ Transcription error at {start}s: {e}")
            finally:
                os.remove(chunk_file)

        with open(self.output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(transcription_output))

        os.remove(audio_path)
        print(f"\n✅ Done! Translated transcription saved to '{self.output_path}'")

class M3U8StreamTranscriber:
    def __init__(self, stream_url, chunk_duration=30, total_duration=120, model_size="base", output_path="transcription_results.txt"):
        self.stream_url = stream_url
        self.chunk_duration = int(chunk_duration)
        self.total_duration = int(total_duration)
        self.model = whisper.load_model(model_size)
        self.output_path = output_path

    def transcribe(self):
        output_file = open(self.output_path, "w", encoding="utf-8")
        start_time = time.time()
        chunk_num = 1

        while time.time() - start_time < self.total_duration:
            with NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
                temp_filename = temp_audio.name

            print(f"\n📡 Recording chunk {chunk_num}...")
            command = [
                "ffmpeg", "-y",
                "-i", self.stream_url,
                "-t", str(self.chunk_duration),
                "-vn",
                "-acodec", "pcm_s16le",
                "-ar", "16000",
                "-ac", "1",
                temp_filename
            ]

            try:
                subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            except subprocess.CalledProcessError:
                print("⚠️ Failed to record this chunk. Retrying...")
                os.remove(temp_filename)
                time.sleep(5)
                continue

            print("📝 Transcribing...")
            try:
                result = self.model.transcribe(temp_filename, task="translate")
                print("🗣️  " + result["text"].strip())
                output_file.write(result["text"].strip() + "\n")
                output_file.flush()
            except Exception as e:
                print(f"❌ Transcription error: {e}")
            finally:
                os.remove(temp_filename)

            chunk_num += 1

        output_file.close()
        print(f"\n✅ Done! Transcription saved to '{self.output_path}'")
