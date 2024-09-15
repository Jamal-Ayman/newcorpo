from flask import request, jsonify, Blueprint, send_file
from flask_jwt_extended import jwt_required
from textblob import TextBlob
import spacy
from sklearn.manifold import TSNE
from sklearn.feature_extraction.text import TfidfVectorizer
import matplotlib.pyplot as plt
import io
import re

text = Blueprint('text', '__name__')


# Creating the most essential sentences from the original text rather than generating new ones.
# ENflask 
def extractive_summarization(text):
    nlp_en = spacy.load("en_core_web_sm")
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
    nlp_en = spacy.load("en_core_web_sm")
    nlp_en.add_pipe("textrank", last=True)
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

@text.route('/tsne', methods=["POST"])
@jwt_required()
def generate_tsne():
    data = request.json.get('texts', [])
    
    if not data or len(data) < 2:
        return jsonify({"error": "Please provide at least two text inputs"}), 400
    
    # Convert the text data to vectors using TF-IDF
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(data).toarray()
    
    # Adjust perplexity to be less than the number of samples
    perplexity_value = min(30, len(data) - 1)  # 30 is a common default value

    # Apply T-SNE
    tsne = TSNE(n_components=2, random_state=42, perplexity=perplexity_value)
    X_embedded = tsne.fit_transform(X)
    
    # Plot the T-SNE
    plt.figure(figsize=(8, 6))
    plt.scatter(X_embedded[:, 0], X_embedded[:, 1])
    
    # Annotate the points with text
    for i, text in enumerate(data):
        plt.annotate(f"Text {i+1}", (X_embedded[i, 0], X_embedded[i, 1]))

    # Save the plot to a PNG image in memory
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    
    # Return the image as a file
    return send_file(img, mimetype='image/png', as_attachment=True, download_name='tsne_visualization.png')

@text.route('/search', methods=["POST"])
@jwt_required()
def search_text():
    text = request.json.get('text', '')
    query = request.json.get('query', '')

    if not query or not text:
        return jsonify({"error": "Text and search query are required"}), 400

    # Search for the query in the provided text
    results = []
    if re.search(query, text, re.IGNORECASE):
        results.append(text)

    return jsonify({"results": results}), 200

@text.route('/categorize', methods=["POST"])
@jwt_required()
def categorize_text():
    categories = {
        "Technology": ["AI", "machine learning", "technology", "software"],
        "Science": ["biology", "chemistry", "physics", "science"],
        "Literature": ["poetry", "novel", "literature", "fiction"]
    }
    
    text = request.json.get('text', '')
    if not text:
        return jsonify({"error": "Text is required"}), 400

    # Simple keyword-based categorization
    assigned_categories = []
    for category, keywords in categories.items():
        if any(keyword.lower() in text.lower() for keyword in keywords):
            assigned_categories.append(category)
    
    return jsonify({"categories": assigned_categories}), 200

@text.route('/custom_query', methods=["POST"])
@jwt_required()
def custom_query():
    text = request.json.get('text', '')
    keyword = request.json.get('keyword', '')
    min_length = request.json.get('min_length', 0)
    
    if not text or not keyword:
        return jsonify({"error": "Text and keyword are required"}), 400
    
    # Check if keyword is in text and text length meets the condition
    keyword_in_text = keyword.lower() in text.lower()
    meets_length_condition = len(text) >= int(min_length)

    return jsonify({
        "keyword_in_text": keyword_in_text,
        "meets_length_condition": meets_length_condition
    }), 200