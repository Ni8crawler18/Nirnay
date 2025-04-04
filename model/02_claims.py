import re
import os
import nltk
import logging
import spacy
from nltk.tokenize import sent_tokenize
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ClaimExtractor:
    def __init__(self, max_claims=6):
        """Initialize the claim extractor with necessary resources"""
        # Download necessary NLTK resources if not already present
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            logger.info("Downloading NLTK punkt tokenizer...")
            nltk.download('punkt', quiet=True)
        
        # Load spaCy model for entity recognition and dependency parsing
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            logger.info("Downloading spaCy model...")
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")
        
        self.max_claims = max_claims
    
    def read_transcription(self, file_path):
        """Read the transcription file and return the content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            logger.info(f"Successfully read transcription from {file_path}")
            return content
        except Exception as e:
            logger.error(f"Error reading transcription file: {e}")
            return None
    
    def clean_text(self, text):
        """Clean the transcription text by removing timestamps and normalizing whitespace"""
        # Remove timestamps in the format [HH:MM:SS]
        cleaned_text = re.sub(r'\[\d{2}:\d{2}:\d{2}\]', '', text)
        
        # Replace multiple whitespaces with a single space
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
        
        # Remove filler words and transition phrases often used in broadcasts
        filler_words = [
            r'\bnow\b', r'\bum\b', r'\buh\b', r'\byou know\b', 
            r'\bas I mentioned\b', r'\bbasically\b'
        ]
        for word in filler_words:
            cleaned_text = re.sub(word, '', cleaned_text, flags=re.IGNORECASE)
        
        # Remove any remaining special characters except basic punctuation
        cleaned_text = re.sub(r'[^\w\s.,;:?!"-]', '', cleaned_text)
        
        return cleaned_text.strip()
    
    def split_into_sentences(self, text):
        """Split the cleaned text into sentences"""
        sentences = sent_tokenize(text)
        return sentences
    
    def extract_factual_claims(self, text):
        """
        Extract specific factual claims from text using NLP techniques
        """
        # Process the text with spaCy
        doc = self.nlp(text)
        
        claims = []
        
        # 1. Extract claims containing numbers (statistics, counts, measurements)
        number_claims = []
        for sent in doc.sents:
            has_number = any(token.like_num for token in sent)
            if has_number:
                number_claims.append(sent.text)
        
        # 2. Extract claims containing named entities (locations, organizations, people)
        entity_claims = []
        for sent in doc.sents:
            entities = [ent.text for ent in sent.ents if ent.label_ in ['GPE', 'LOC', 'ORG', 'PERSON']]
            if entities:
                entity_claims.append(sent.text)
        
        # 3. Extract claims with reporting verbs or attribution
        attribution_claims = []
        attribution_patterns = [
            'according to', 'said', 'reported', 'announced', 
            'confirmed', 'stated', 'revealed', 'released'
        ]
        for sent in doc.sents:
            if any(pattern in sent.text.lower() for pattern in attribution_patterns):
                attribution_claims.append(sent.text)
        
        # Combine all types of claims, removing duplicates
        all_claims = list(set(number_claims + entity_claims + attribution_claims))
        
        # Filter out questions and very short sentences
        filtered_claims = [claim for claim in all_claims 
                          if not claim.endswith('?') and len(claim.split()) > 4]
        
        return filtered_claims
    
    def score_claim_importance(self, claim):
        """Score claims based on factual importance for fact-checking"""
        score = 0
        
        # Process with spaCy
        doc = self.nlp(claim)
        
        # Higher score for claims with numbers
        if any(token.like_num for token in doc):
            score += 3
        
        # Higher score for claims with named entities
        named_entities = [ent for ent in doc.ents if ent.label_ in ['GPE', 'LOC', 'ORG', 'PERSON']]
        score += len(named_entities)
        
        # Higher score for claims with attribution
        attribution_terms = ['according to', 'said', 'reported', 'announced', 'confirmed']
        if any(term in claim.lower() for term in attribution_terms):
            score += 2
        
        # Higher score for claims mentioning important topics
        important_topics = ['death', 'casualties', 'injured', 'killed', 'disaster', 
                           'earthquake', 'flood', 'hurricane', 'crisis', 'emergency',
                           'government', 'officials', 'president', 'minister']
        if any(topic in claim.lower() for topic in important_topics):
            score += 2
        
        # Lower score for claims that are likely opinions or predictions
        opinion_markers = ['may', 'might', 'could', 'possibly', 'probably', 'likely']
        if any(marker in claim.lower() for marker in opinion_markers):
            score -= 1
        
        return score
    
    def select_top_claims(self, claims, max_claims=6):
        """Select the top claims based on importance score"""
        # Score each claim
        scored_claims = [(claim, self.score_claim_importance(claim)) for claim in claims]
        
        # Sort by score (descending)
        sorted_claims = sorted(scored_claims, key=lambda x: x[1], reverse=True)
        
        # Take top N claims
        top_claims = [claim for claim, score in sorted_claims[:max_claims]]
        
        return top_claims
    
    def process_transcription(self, input_file, output_file):
        """Process the transcription and save extracted claims"""
        # Read the transcription
        content = self.read_transcription(input_file)
        if not content:
            return False
        
        # Clean the text
        cleaned_text = self.clean_text(content)
        
        # Extract factual claims
        all_claims = self.extract_factual_claims(cleaned_text)
        
        # Select top claims
        top_claims = self.select_top_claims(all_claims, self.max_claims)
        
        # Format claims with IDs
        formatted_claims = []
        for i, claim in enumerate(top_claims):
            claim_id = f"CLAIM_{i+1}"
            formatted_claims.append(f"{claim_id}: {claim}")
        
        # Join claims with double newlines
        output_text = "\n\n".join(formatted_claims)
        
        # Save to file
        try:
            with open(output_file, 'w', encoding='utf-8') as file:
                file.write(output_text)
            logger.info(f"Successfully saved {len(top_claims)} claims to {output_file}")
            return True
        except Exception as e:
            logger.error(f"Error saving claims to file: {e}")
            return False

def main():
    input_file = "transcription_results.txt"
    output_file = "claims.txt"
    
    # Check if input file exists
    if not os.path.exists(input_file):
        logger.error(f"Input file not found: {input_file}")
        return
    
    extractor = ClaimExtractor(max_claims=5)
    success = extractor.process_transcription(input_file, output_file)
    
    if success:
        print(f"Claims extraction completed successfully.")
        print(f"Extracted claims saved to: {output_file}")
    else:
        print("Claims extraction failed. Check the logs for details.")

if __name__ == "__main__":
    main()