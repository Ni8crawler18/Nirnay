import os
import queue
import threading
import time
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import transcribe, claims

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict to ["POST", "GET"] if needed
    allow_headers=["*"],
)

# Queues for processing
text_queue = queue.Queue()

# Ensure model directory has an __init__.py
os.makedirs("model", exist_ok=True)
open("model/__init__.py", "a").close()

# Request model
class TranscribeRequest(BaseModel):
    url: str
    chunk_duration: int = 30
    model_size: str = "base"

@app.post("/transcribe")
async def transcribe_audio(request: TranscribeRequest, background_tasks: BackgroundTasks):
    """Endpoint to transcribe a live stream."""
    transcription_file = f"transcription_{int(time.time())}.txt"
    background_tasks.add_task(process_transcription, request.url, request.chunk_duration, request.model_size, transcription_file)
    return {"message": "Transcription started", "file": transcription_file}

def process_transcription(url, chunk_duration, model_size, output_file):
    """Runs the transcription pipeline in the background."""
    transcriber = transcribe.M3U8StreamTranscriber(url, chunk_duration, model_size)
    transcription_file = transcriber.transcribe()  # Default 5 minutes
    os.rename(transcription_file, output_file)  # Rename file for uniqueness
    text_queue.put(output_file)

@app.post("/extract_claims")
async def extract_claims():
    """Endpoint to extract claims from the last transcription."""
    if text_queue.empty():
        return {"error": "No transcription available"}
    
    transcription_file = text_queue.get()
    claims_file = transcription_file.replace("transcription", "claims")

    extractor = claims.ClaimExtractor()
    success = extractor.process_transcription(transcription_file, claims_file)

    if success:
        return {"message": "Claims extracted", "output_file": claims_file}
    return {"error": "Claims extraction failed"}

@app.get("/")
def root():
    return {"message": "Server is running!"}

@app.get("/ping")
def ping():
    return {"message": "pong"}
