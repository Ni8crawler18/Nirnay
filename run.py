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
    output_file = "transcription_results.txt"
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

import time

@app.post("/extract_claims")
async def extract_claims():
    transcription_file = "transcription_results.txt"
    claims_file = "claims_results.txt"

    # Wait 60 seconds to allow transcription to complete
    time.sleep(60)

    extractor = claim_module.ClaimExtractor()
    success = extractor.process_transcription(transcription_file, claims_file)

    if success:
        with open(transcription_file, "r", encoding="utf-8") as tf:
            transcription_text = tf.read()

        with open(claims_file, "r", encoding="utf-8") as cf:
            claims_text = cf.read()

        return {
            "message": "Claims extracted",
            "transcription": transcription_text,
            "claims": claims_text.splitlines()  # split into list of claims
        }

    return {"error": "Extraction failed"}

@app.get("/get_transcription")
async def get_transcription():
    transcription_file = "transcription_results.txt"

    if not os.path.exists(transcription_file) or os.path.getsize(transcription_file) == 0:
        return {"error": "Transcription not available yet"}

    with open(transcription_file, "r", encoding="utf-8") as tf:
        transcription_text = tf.read()

    return {
        "message": "Transcription fetched successfully",
        "transcription": transcription_text
    }


@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/ping")
def ping():
    return {"message": "pong"}