import os
import time
import whisper
import argparse
import threading
import queue
import yt_dlp
import torch
from pydub import AudioSegment
import subprocess

class LiveStreamTranscriber:
    def __init__(self, url, chunk_duration=30, model_size="base"):
        self.url = url
        self.chunk_duration = chunk_duration
        self.model = whisper.load_model(model_size)
        self.audio_queue = queue.Queue()
        self.text_queue = queue.Queue()
        self.stop_event = threading.Event()
        self.temp_dir = "temp_audio"
        os.makedirs(self.temp_dir, exist_ok=True)

    def download_audio(self, output_file):
        """Download audio from a live stream using yt-dlp."""
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': output_file,
            'quiet': False,
            'no_warnings': True,
            'live_from_start': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'wav',
            }],
        }

        def download_thread():
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([self.url])
            except Exception as e:
                print(f"Error downloading stream: {e}")
                self.stop_event.set()

        thread = threading.Thread(target=download_thread)
        thread.daemon = True
        thread.start()
        return thread

    def extract_audio_chunks(self, input_file):
        """Extracts audio in chunks from a live stream."""
        base_file = os.path.splitext(input_file)[0]
        last_processed_time = 0

        while not self.stop_event.is_set():
            try:
                if os.path.exists(f"{base_file}.wav"):
                    audio = AudioSegment.from_wav(f"{base_file}.wav")
                    duration_ms = len(audio)
                    duration_sec = duration_ms / 1000

                    while last_processed_time + self.chunk_duration <= duration_sec:
                        chunk_start = last_processed_time * 1000
                        chunk_end = (last_processed_time + self.chunk_duration) * 1000
                        chunk = audio[chunk_start:chunk_end]

                        chunk_filename = f"{base_file}_chunk_{last_processed_time}.wav"
                        chunk.export(chunk_filename, format="wav")

                        self.audio_queue.put(chunk_filename)
                        last_processed_time += self.chunk_duration
                        print(f"Extracted chunk ending at {last_processed_time} seconds")

                time.sleep(2)

            except Exception as e:
                print(f"Error extracting audio chunk: {e}")
                time.sleep(2)

    def transcribe_chunks(self):
        """Transcribes extracted audio chunks using Whisper."""
        while not self.stop_event.is_set() or not self.audio_queue.empty():
            try:
                chunk_file = self.audio_queue.get(timeout=2)
                result = self.model.transcribe(chunk_file)
                transcription = result["text"].strip()

                self.text_queue.put(transcription)
                print(f"Transcribed: {transcription[:50]}...")

                os.remove(chunk_file)

            except queue.Empty:
                continue
            except Exception as e:
                print(f"Error transcribing chunk: {e}")

    def process_live_stream(self, duration=None):
        """Main function to process a live stream."""
        temp_file = os.path.join(self.temp_dir, f"live_stream_{int(time.time())}")
        download_thread = self.download_audio(temp_file)
        extract_thread = threading.Thread(target=self.extract_audio_chunks, args=(temp_file,))
        extract_thread.daemon = True
        extract_thread.start()
        transcribe_thread = threading.Thread(target=self.transcribe_chunks)
        transcribe_thread.daemon = True
        transcribe_thread.start()

        start_time = time.time()

        try:
            while duration is None or time.time() - start_time < duration:
                time.sleep(2)
                if not download_thread.is_alive() and not extract_thread.is_alive():
                    print("Download and extraction completed.")
                    break
        except KeyboardInterrupt:
            print("Process interrupted by user.")

        finally:
            self.stop_event.set()
            download_thread.join(timeout=3)
            extract_thread.join(timeout=3)
            transcribe_thread.join(timeout=3)

            with open("transcription_results.txt", "w", encoding="utf-8") as f:
                while not self.text_queue.empty():
                    f.write(self.text_queue.get() + "\n")

            print("Transcription saved to transcription_results.txt")

def main():
    parser = argparse.ArgumentParser(description="Live stream transcriber")
    parser.add_argument("url", help="URL of the live stream")
    parser.add_argument("--duration", type=int, default=300, help="Processing duration in seconds")
    parser.add_argument("--chunk", type=int, default=30, help="Chunk duration in seconds")
    parser.add_argument("--model", type=str, default="base", help="Whisper model size")
    args = parser.parse_args()

    if not torch.cuda.is_available():
        print("Warning: CUDA not available. Transcription will be slow on CPU.")

    transcriber = LiveStreamTranscriber(args.url, args.chunk, args.model)
    transcriber.process_live_stream(args.duration)

if __name__ == "__main__":
    main()