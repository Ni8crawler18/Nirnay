import os
import time
import whisper
import subprocess
import yt_dlp
from pydub import AudioSegment
from tempfile import NamedTemporaryFile

# Load Whisper only once to avoid reloading for every instance
WHISPER_MODEL = whisper.load_model("base", device="cpu")  # or use "cuda" if you have GPU

class YouTubeTranscriber:
    def __init__(self, url, chunk_duration=30, output_path="transcription_results.txt"):
        self.url = url
        self.model = WHISPER_MODEL
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
                'preferredquality': '64',  # Lower quality = smaller = faster
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([self.url])
        return out_path.replace("%(ext)s", "wav")

    def transcribe(self):
        audio_path = self.download_audio_file()
        audio = AudioSegment.from_wav(audio_path)
        duration = len(audio) // 1000

        output = []
        for start in range(0, duration, self.chunk_duration):
            end = min(start + self.chunk_duration, duration)
            chunk = audio[start * 1000:end * 1000]
            chunk_file = os.path.join(self.temp_dir, f"chunk_{start}_{end}.wav")
            chunk.export(chunk_file, format="wav")

            try:
                result = self.model.transcribe(chunk_file, fp16=False)  # Avoid FP16 warning
                output.append(result["text"].strip())
            except Exception:
                pass
            finally:
                os.remove(chunk_file)

        with open(self.output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(output))

        os.remove(audio_path)
        return self.output_path


class M3U8StreamTranscriber:
    def __init__(self, stream_url, chunk_duration=30, total_duration=120, model_size="base", output_path="transcription_results.txt"):
        self.stream_url = stream_url
        self.chunk_duration = int(chunk_duration)
        self.total_duration = int(total_duration)
        self.model = WHISPER_MODEL
        self.output_path = output_path

    def transcribe(self):
        with open(self.output_path, "w", encoding="utf-8") as output_file:
            start_time = time.time()

            while time.time() - start_time < self.total_duration:
                with NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
                    temp_filename = temp_audio.name

                command = [
                    "ffmpeg", "-loglevel", "quiet", "-y",
                    "-i", self.stream_url,
                    "-t", str(self.chunk_duration),
                    "-vn",
                    "-acodec", "pcm_s16le",
                    "-ar", "16000",  # Lower sample rate = faster
                    "-ac", "1",
                    temp_filename
                ]

                try:
                    subprocess.run(command, check=True)
                except subprocess.CalledProcessError:
                    os.remove(temp_filename)
                    time.sleep(2)
                    continue

                try:
                    result = self.model.transcribe(temp_filename, fp16=False)
                    output_file.write(result["text"].strip() + "\n")
                    output_file.flush()
                except Exception:
                    pass
                finally:
                    os.remove(temp_filename)

        return self.output_path