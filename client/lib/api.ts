import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Update if backend is hosted elsewhere

export const transcribeAudio = async (url: string, chunkDuration: number = 30, modelSize: string = "base") => {
    try {
        const response = await axios.post(`${API_BASE_URL}/transcribe`, { url, chunk_duration: chunkDuration, model_size: modelSize });
        return response.data;
    } catch (error) {
        console.error("Error in transcription request:", error);
        throw error;
    }
};

export const extractClaims = async (url: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/extract_claims`, { url }); // Include URL in the request
        return response.data;
    } catch (error) {
        console.error("Error in claim extraction request:", error);
        throw error;
    }
};

export const pingServer = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/ping");
      console.log("Backend is up:", response.data);
    } catch (err) {
      console.error("Can't reach backend:", err);
    }
  };
  