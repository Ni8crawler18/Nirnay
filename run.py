import os
import time
import queue
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model import transcriber, claims as claim_module

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

text_queue = queue.Queue()

class TranscribeRequest(BaseModel):
    url: str
    chunk_duration: int = 30
    model_size: str = "base"
    duration: int = 120

@app.post("/transcribe")
async def transcribe_audio(request: TranscribeRequest, background_tasks: BackgroundTasks):
    timestamp = int(time.time())
    output_file = f"transcription_{timestamp}.txt"
    background_tasks.add_task(
        transcribe_background,
        request.url,
        request.chunk_duration,
        request.duration,
        request.model_size,
        output_file
    )
    return {"message": "Transcription started", "file": output_file}

def transcribe_background(url, chunk_duration, duration, model_size, output_file):
    transcriber_instance = transcriber.M3U8StreamTranscriber(
        stream_url=url,
        chunk_duration=chunk_duration,
        total_duration=duration,
        model_size=model_size,
        output_path=output_file
    )
    path = transcriber_instance.transcribe()
    text_queue.put(path)

@app.post("/extract_claims")
async def extract_claims():
    if text_queue.empty():
        return {"error": "No transcription file found"}

    transcription_file = text_queue.get()
    claims_file = transcription_file.replace("transcription", "claims")

    extractor = claim_module.ClaimExtractor()
    success = extractor.process_transcription(transcription_file, claims_file)

    if success:
        return {"message": "Claims extracted", "file": claims_file}
    return {"error": "Extraction failed"}

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/ping")
def ping():
    return {"message": "pong"}