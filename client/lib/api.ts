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

export const extractClaims = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/extract_claims`);
        console.log("Extract claims response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in claim extraction request:", error);
        throw error;
    }
}

export const getTranscription = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_transcription`);
        console.log("Get transcription response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching transcription:", error);
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
  