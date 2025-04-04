import os
import re
import nltk
import spacy
from nltk.tokenize import sent_tokenize

class ClaimExtractor:
    def __init__(self, max_claims=5):
        self.max_claims = max_claims

        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')

        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")

    def read_transcription(self, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error reading transcription: {e}")
            return ""

    def clean_text(self, text):
        text = re.sub(r'\[\d{2}:\d{2}:\d{2}\]', '', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def extract_factual_claims(self, text):
        doc = self.nlp(text)
        claims = []

        for sent in doc.sents:
            entities = [ent.text for ent in sent.ents]
            has_number = any(tok.like_num for tok in sent)

            if entities and has_number:
                sentence = sent.text.strip()
                if 6 < len(sentence.split()) < 25:
                    claims.append(sentence)

        return list(set(claims))[:self.max_claims]

    def process_transcription(self, input_file, output_file):
        text = self.read_transcription(input_file)
        if not text:
            return False

        cleaned = self.clean_text(text)
        claims = self.extract_factual_claims(cleaned)

        if not claims:
            return False

        with open(output_file, 'w', encoding='utf-8') as f:
            for idx, claim in enumerate(claims, 1):
                f.write(f"CLAIM_{idx}: {claim.strip()}\n")

        return True