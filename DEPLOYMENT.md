# Braille World Deployment Guide

## Quick Start

### Local Development
```bash
# Run the application
python app.py
# or
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
```

### Using Docker
```bash
# Build the image
docker build -t braille-world .

# Run the container
docker run -p 5000:5000 braille-world
```

## Dependencies

All dependencies are managed through `pyproject.toml`:
- Flask 3.1.1+ - Web framework
- Flask-SQLAlchemy 3.1.1+ - Database ORM
- Gunicorn 23.0.0+ - WSGI server
- Pillow 11.2.1+ - Image processing
- pytesseract 0.3.13+ - OCR functionality
- psycopg2-binary 2.9.10+ - PostgreSQL adapter
- Werkzeug 3.1.3+ - WSGI utilities
- email-validator 2.2.0+ - Email validation

## Platform Support

### Web Browsers
- Chrome/Chromium (recommended for speech features)
- Firefox
- Safari
- Edge

### Mobile Platforms
- Android WebView (with JavaScript bridge)
- iOS Safari
- Progressive Web App (PWA) ready

### Deployment Platforms
- Render.com (configured)
- Heroku
- Docker containers
- Any Python 3.11+ hosting

## Features
- Text-to-Braille conversion (English/Hindi)
- Image-to-Braille with OCR
- Google Assistant-style voice recognition
- Advanced Text-to-Speech with language selection
- Cross-platform compatibility
- Android WebView integration

## Environment Variables
- `SESSION_SECRET` - Flask session secret
- `DATABASE_URL` - PostgreSQL connection string (optional)

## System Dependencies (for Docker/Linux)
- tesseract-ocr
- tesseract-ocr-eng
- tesseract-ocr-hin
- libtesseract-dev