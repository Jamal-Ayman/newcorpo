# Dockerfile
FROM python:3.10

# Install required system packages for OpenCV
RUN apt-get update && apt-get install -y libgl1-mesa-glx
RUN apt-get install -y \
    build-essential \
    gcc \
    g++ \
    libatlas-base-dev \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable for NLTK data
ENV NLTK_DATA=/usr/local/share/nltk_data

# Create NLTK data directory
RUN mkdir -p /usr/local/share/nltk_data

# Set working directory
WORKDIR /app

# Copy the application code
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install NLTK and download the required datasets
RUN python -m nltk.downloader punkt stopwords punkt_tab

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py

# Run the Flask app
CMD ["flask", "run", "--host=0.0.0.0"]
