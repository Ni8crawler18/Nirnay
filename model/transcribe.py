import os
import time
import whisper
import threading
import queue
import yt_dlp
import torch
from pydub import AudioSegment

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
            'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'wav'}],
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
                    duration_sec = len(audio) / 1000

                    while last_processed_time + self.chunk_duration <= duration_sec:
                        chunk = audio[last_processed_time * 1000:(last_processed_time + self.chunk_duration) * 1000]
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
        transcription_text = []

        while not self.stop_event.is_set() or not self.audio_queue.empty():
            try:
                chunk_file = self.audio_queue.get(timeout=2)
                result = self.model.transcribe(chunk_file)
                transcription = result["text"].strip()

                transcription_text.append(transcription)
                os.remove(chunk_file)

            except queue.Empty:
                continue
            except Exception as e:
                print(f"Error transcribing chunk: {e}")

        # Save transcription to a file
        transcription_file = "transcription_results.txt"
        with open(transcription_file, "w", encoding="utf-8") as f:
            f.write("\n".join(transcription_text))

        return transcription_file

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
                    break
        except KeyboardInterrupt:
            print("Process interrupted by user.")
        finally:
            self.stop_event.set()
            download_thread.join(timeout=3)
            extract_thread.join(timeout=3)
            transcribe_thread.join(timeout=3)

        return "transcription_results.txt"
