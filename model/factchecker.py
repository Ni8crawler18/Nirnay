import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")

API_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

CLAIMS_FILE = "claims.txt"
OUTPUT_FILE = "sources.txt"


def fact_check_claim(claim_text):
    params = {
        "key": API_KEY,
        "query": claim_text,
        "languageCode": "en",
    }

    try:
        response = requests.get(API_URL, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Error checking claim: {e}")
        return None


def process_claims():
    with open(CLAIMS_FILE, "r", encoding="utf-8") as f:
        claims = [line.strip() for line in f if line.strip()]

    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        for idx, claim in enumerate(claims, 1):
            print(f"\n🔎 Checking claim {idx}: {claim}")
            data = fact_check_claim(claim)

            if not data or "claims" not in data:
                print("⚠️ No sources found.")
                out.write(f"Claim: {claim}\nSources: None found.\n\n")
                continue

            out.write(f"Claim: {claim}\nSources:\n")
            for claim_entry in data["claims"]:
                for review in claim_entry.get("claimReview", []):
                    source_url = review.get("url", "No URL")
                    publisher = review.get("publisher", {}).get("name", "Unknown")
                    rating = review.get("textualRating", "No Rating")
                    out.write(f"  - Source: {source_url}\n    Publisher: {publisher}\n    Rating: {rating}\n")
            out.write("\n")

            time.sleep(1.1)  # Be nice to the API

    print(f"\n✅ Fact-checking done! Results saved to '{OUTPUT_FILE}'")


if __name__ == "__main__":
    process_claims()