from transformers import pipeline

# Explicitly load model to avoid default warnings
_sentiment = pipeline(
    "sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english"
)


def analyze_sentiment(text):
    result = _sentiment(text)[0]
    label = result["label"]
    score = result["score"]
    
    if label == "POSITIVE":
        return "happy" if score > 0.8 else "neutral"
    else:
        return "sad" if score > 0.8 else "neutral"
