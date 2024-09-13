from flask import request, jsonify, Blueprint, send_file
import numpy as np
from flask_jwt_extended import jwt_required
from textblob import TextBlob
import matplotlib.pyplot as plt
import spacy
from sklearn.manifold import TSNE
from io import BytesIO

text = Blueprint('text', '__name__')


# Creating the most essential sentences from the original text rather than generating new ones.
# EN
def extractive_summarization(text):
    nlp_en = spacy.load("en_core_web_lg")
    nlp_en.add_pipe("textrank", last=True)
    doc = nlp_en(text)
    # Summarize the text using textrank
    summary_sentences = []
    for sent in doc._.textrank.summary(limit_phrases=2, limit_sentences=2):
        summary_sentences.append(str(sent))
        return ' '.join(summary_sentences)

@text.route('/summary', methods=["POST"])
@jwt_required()
def text_summerize():
    text = request.json.get('text')
    if not text:
        return jsonify({"message":"invalid request body"}), 400
    
    summrized_text = extractive_summarization(text)
    return jsonify({"message": summrized_text}), 200

# Named Entity recognition (NER) 
# categorize entities like names, dates, 
# and locations within text

@text.route('/extract_keywords', methods=["POST"])
@jwt_required()
def extract_keywords():
    data = request.json
    text = data.get('text')

    if not text:
        return jsonify({'error': 'Text not provided'}), 400

    doc = nlp_en(text)
    keywords = [ent.text for ent in doc.ents]  # Extract named entities

    return jsonify({'keywords': keywords})


@text.route('/sentiment', methods=["POST"])
@jwt_required()
def sentiment_analysis():
    text = request.json.get('text')

    if not text:
        return jsonify({'message': 'Text not provided'}), 400

    blob = TextBlob(text)
    sentiment = blob.sentiment

    return jsonify({
        'polarity': sentiment.polarity,  
        'subjectivity': sentiment.subjectivity  
    })

# @text.route('/tsne', methods=["POST"])
# @jwt_required()
# def tsne_visualization():
#     nlp_en = spacy.load("en_core_web_lg")
#     nlp_en.add_pipe("textrank", last=True)
#     texts = request.json.get('texts')

#     if not texts or len(texts) < 2:
#         return jsonify({'message': 'At least two texts are required'}), 400

#     # Convert each text into a vector using spaCy's built-in vectors
#     vectors = np.array([nlp_en(text).vector for text in texts])

#     tsne = TSNE(n_components=2, random_state=42)
#     X_tsne = tsne.fit_transform(vectors)

#     # Plot T-SNE
#     plt.figure(figsize=(8, 6))
#     plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=np.random.rand(len(texts)))

#     for i, text in enumerate(texts):
#         plt.annotate(f"Text {i+1}", (X_tsne[i, 0], X_tsne[i, 1]))

#     img = BytesIO()
#     plt.savefig(img, format='png')
#     img.seek(0)

#     return send_file(img, mimetype='image/png')