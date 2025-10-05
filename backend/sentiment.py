from transformers import pipeline

_sentiment = pipeline("sentiment-analysis")


def analyze_sentiment(text):
    result = _sentiment(text)[0]
    return result["label"]
