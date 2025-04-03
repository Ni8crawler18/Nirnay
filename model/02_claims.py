import re
import os
import nltk
import logging
import nltk
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ClaimExtractor:
    def __init__(self):
        """Initialize the claim extractor with necessary NLTK resources"""
        # Download necessary NLTK resources if not already present
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            logger.info("Downloading NLTK punkt tokenizer...")
            nltk.download('punkt', quiet=True)
    
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
        
        # Remove any remaining special characters except basic punctuation
        cleaned_text = re.sub(r'[^\w\s.,;:?!"-]', '', cleaned_text)
        
        return cleaned_text.strip()
    
    def split_into_sentences(self, text):
        """Split the cleaned text into sentences"""
        sentences = sent_tokenize(text)
        return sentences
    
    def is_claim(self, sentence):
        """
        Determine if a sentence is likely a claim/factual statement
        
        This function uses some heuristics to identify sentences that are more
        likely to be factual claims rather than opinions or other types of statements.
        """
        # Skip very short sentences - likely not full claims
        if len(sentence.split()) < 5:
            return False
        
        # Skip sentences that are questions
        if sentence.endswith('?'):
            return False
        
        # Skip sentences that explicitly state they are opinions
        opinion_phrases = [
            "i think", "i believe", "in my opinion", "i feel", 
            "arguably", "perhaps", "maybe", "might be", "could be",
            "it seems", "probably", "possibly"
        ]
        
        lower_sent = sentence.lower()
        if any(phrase in lower_sent for phrase in opinion_phrases):
            return False
        
        # Look for indicators of factual claims
        claim_indicators = [
            "will", "is", "are", "was", "were", "has", "have", "had",
            "can", "should", "must", "need to", "required", 
            "according to", "research shows", "studies indicate",
            "increased", "decreased", "changed", "introduced",
            "announced", "implemented", "established", "mandatory",
            "rules", "regulations", "policy", "requirement", "system"
        ]
        
        # Check if any claim indicators are present
        if any(indicator in lower_sent for indicator in claim_indicators):
            return True
            
        # Default - if we're not sure, include it as it might be a claim
        return True
    
    def extract_claims(self, sentences):
        """Extract claims from the list of sentences"""
        claims = []
        for i, sentence in enumerate(sentences):
            if self.is_claim(sentence):
                # Add a unique ID to each claim for reference
                claim_id = f"CLAIM_{i+1}"
                claims.append((claim_id, sentence))
        
        logger.info(f"Extracted {len(claims)} potential claims from {len(sentences)} sentences")
        return claims
    
    def format_claims(self, claims):
        """Format the claims for output"""
        formatted = []
        for claim_id, claim_text in claims:
            formatted.append(f"{claim_id}: {claim_text}")
        
        return "\n\n".join(formatted)
    
    def process_transcription(self, input_file, output_file):
        """Process the transcription and save extracted claims"""
        # Read the transcription
        content = self.read_transcription(input_file)
        if not content:
            return False
        
        # Process the text
        cleaned_text = self.clean_text(content)
        sentences = self.split_into_sentences(cleaned_text)
        claims = self.extract_claims(sentences)
        formatted_claims = self.format_claims(claims)
        
        # Save the claims
        try:
            with open(output_file, 'w', encoding='utf-8') as file:
                file.write(formatted_claims)
            logger.info(f"Successfully saved {len(claims)} claims to {output_file}")
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
    
    extractor = ClaimExtractor()
    success = extractor.process_transcription(input_file, output_file)
    
    if success:
        print(f"Claims extraction completed successfully.")
        print(f"Extracted claims saved to: {output_file}")
    else:
        print("Claims extraction failed. Check the logs for details.")

if __name__ == "__main__":
    main()