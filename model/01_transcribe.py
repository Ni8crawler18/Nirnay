import os
import time
import subprocess
import whisper
import argparse
import threading
import queue
import yt_dlp
import torch
from pydub import AudioSegment
import re

class LiveVideoProcessor:
    def __init__(self, chunk_duration=30, model_size="base"):
        """
        Initialize the processor with configurable chunk duration and model size
        
        Args:
            chunk_duration (int): Duration of each chunk in seconds
            model_size (str): Size of the Whisper model to use (tiny, base, small, medium, large)
        """
        self.chunk_duration = chunk_duration
        self.model = whisper.load_model(model_size)
        self.audio_queue = queue.Queue()
        self.text_queue = queue.Queue()
        self.stop_event = threading.Event()

    def download_live_stream(self, url, output_file):
        """
        Download audio from a YouTube live stream using yt-dlp
        
        Args:
            url (str): URL of the YouTube live stream
            output_file (str): Path to save the downloaded audio
        """
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': output_file,
            'quiet': True,
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
                    ydl.download([url])
            except Exception as e:
                print(f"Error downloading stream: {e}")
                self.stop_event.set()
                
        # Start download in a separate thread
        thread = threading.Thread(target=download_thread)
        thread.daemon = True
        thread.start()
        
        return thread

    def extract_audio_chunks(self, input_file):
        """
        Extract audio chunks from a file as it's being downloaded
        
        Args:
            input_file (str): Path to the audio file
        """
        base_file = os.path.splitext(input_file)[0]
        chunk_file_pattern = f"{base_file}_chunk_%d.wav"
        last_processed_time = 0
        
        while not self.stop_event.is_set():
            try:
                # Check if file exists and has grown since last check
                if os.path.exists(f"{base_file}.wav"):
                    audio = AudioSegment.from_wav(f"{base_file}.wav")
                    duration_ms = len(audio)
                    duration_sec = duration_ms / 1000
                    
                    # Process new chunks
                    while last_processed_time + self.chunk_duration <= duration_sec:
                        chunk_start = last_processed_time * 1000  # to milliseconds
                        chunk_end = (last_processed_time + self.chunk_duration) * 1000
                        
                        # Extract chunk
                        chunk = audio[chunk_start:chunk_end]
                        chunk_filename = chunk_file_pattern % (last_processed_time // self.chunk_duration)
                        chunk.export(chunk_filename, format="wav")
                        
                        # Add to processing queue
                        self.audio_queue.put(chunk_filename)
                        
                        last_processed_time += self.chunk_duration
                        print(f"Extracted chunk ending at {last_processed_time} seconds")
                
                # Sleep briefly to avoid excessive CPU usage
                time.sleep(1)
                
            except Exception as e:
                print(f"Error extracting audio chunk: {e}")
                time.sleep(1)  # On error, wait a bit before retrying

    def transcribe_chunks(self):
        """
        Continuously transcribe audio chunks from the queue
        """
        while not self.stop_event.is_set() or not self.audio_queue.empty():
            try:
                # Get next chunk with timeout to allow checking stop_event
                try:
                    chunk_file = self.audio_queue.get(timeout=1)
                except queue.Empty:
                    continue
                
                # Transcribe audio
                result = self.model.transcribe(chunk_file)
                transcription = result["text"].strip()
                timestamp = re.search(r'chunk_(\d+)', chunk_file).group(1)
                timestamp = int(timestamp) * self.chunk_duration
                
                # Store result
                chunk_data = {
                    "timestamp": timestamp,
                    "text": transcription,
                    "timestamp_formatted": time.strftime('%H:%M:%S', time.gmtime(timestamp))
                }
                
                self.text_queue.put(chunk_data)
                print(f"Transcribed chunk at {chunk_data['timestamp_formatted']}: {transcription[:50]}...")
                
                # Optionally clean up processed chunk
                os.remove(chunk_file)
                
            except Exception as e:
                print(f"Error transcribing chunk: {e}")

    def get_transcriptions(self):
        """
        Get all available transcriptions from the queue
        
        Returns:
            list: List of transcription dictionaries with timestamp and text
        """
        transcriptions = []
        while not self.text_queue.empty():
            transcriptions.append(self.text_queue.get())
        return transcriptions

    def process_url(self, url, duration=None):
        """
        Process a URL for the specified duration
        
        Args:
            url (str): URL of the YouTube live stream
            duration (int): Duration to process in seconds, None for indefinite
        
        Returns:
            list: Complete list of transcriptions
        """
        # Create temporary file names
        temp_dir = "temp_audio"
        os.makedirs(temp_dir, exist_ok=True)
        timestamp = int(time.time())
        base_output_file = f"{temp_dir}/stream_{timestamp}"
        
        # Start the download process
        download_thread = self.download_live_stream(url, base_output_file)
        
        # Start audio extraction in a separate thread
        extraction_thread = threading.Thread(target=self.extract_audio_chunks, args=(base_output_file,))
        extraction_thread.daemon = True
        extraction_thread.start()
        
        # Start transcription in a separate thread
        transcription_thread = threading.Thread(target=self.transcribe_chunks)
        transcription_thread.daemon = True
        transcription_thread.start()
        
        # Run for specified duration or until stopped
        start_time = time.time()
        try:
            while duration is None or time.time() - start_time < duration:
                time.sleep(1)
                if not download_thread.is_alive() and not extraction_thread.is_alive():
                    print("Download and extraction completed.")
                    break
        except KeyboardInterrupt:
            print("Process interrupted by user.")
        finally:
            # Signal all threads to stop
            self.stop_event.set()
            
            # Wait for threads to finish
            if download_thread.is_alive():
                download_thread.join(timeout=2)
            if extraction_thread.is_alive():
                extraction_thread.join(timeout=2)
            if transcription_thread.is_alive():
                transcription_thread.join(timeout=2)
            
            # Get all transcriptions
            all_transcriptions = self.get_transcriptions()
            
            # Clean up any remaining temp files
            for file in os.listdir(temp_dir):
                if file.startswith(f"stream_{timestamp}"):
                    try:
                        os.remove(os.path.join(temp_dir, file))
                    except:
                        pass
                        
            return all_transcriptions

def main():
    parser = argparse.ArgumentParser(description="Process a live YouTube stream to text transcriptions")
    parser.add_argument("url", help="URL of the YouTube live stream")
    parser.add_argument("--duration", type=int, default=300, help="Duration to process in seconds (default: 300)")
    parser.add_argument("--chunk", type=int, default=30, help="Chunk duration in seconds (default: 30)")
    parser.add_argument("--model", type=str, default="base", help="Whisper model size (tiny, base, small, medium, large)")
    args = parser.parse_args()
    
    if not torch.cuda.is_available():
        print("Warning: CUDA not available. Transcription will be slow on CPU.")
    
    processor = LiveVideoProcessor(chunk_duration=args.chunk, model_size=args.model)
    
    print(f"Processing {args.url} for {args.duration} seconds with {args.chunk}-second chunks...")
    transcriptions = processor.process_url(args.url, args.duration)
    
    # Print all transcriptions
    print("\nTranscription Results:")
    for t in sorted(transcriptions, key=lambda x: x["timestamp"]):
        print(f"[{t['timestamp_formatted']}] {t['text']}")
    
    # Save to file
    with open("transcription_results.txt", "w", encoding="utf-8") as f:
        for t in sorted(transcriptions, key=lambda x: x["timestamp"]):
            f.write(f"[{t['timestamp_formatted']}] {t['text']}\n")
    
    print(f"\nTranscription saved to transcription_results.txt")

if __name__ == "__main__":
    main()