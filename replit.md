# Braille World Web Application

## Overview
A comprehensive Flask-based Braille accessibility web application providing advanced text-to-Braille, image-to-Braille with OCR, and enhanced speech recognition features. The application supports both Hindi and English languages with proper Braille conversion and cross-platform compatibility.

## Project Architecture

### Core Services
- **Text-to-Braille Converter**: Real-time text conversion with language support
- **Image-to-Braille Converter**: OCR-based image processing with Tesseract
- **Speech-to-Text**: Google Assistant-style voice recognition with enhanced UI
- **Text-to-Speech**: Advanced TTS with language-specific voice selection

### Enhanced Features (Latest Updates)
- **Google Assistant-Style Voice Modal**: Animated modal with Google branding and visual feedback
- **Advanced TTS System**: Language-specific voice selection with fallback mechanisms
- **Enhanced UI Animations**: Pulse animations, glow effects, and responsive design
- **Cross-Platform Compatibility**: Works in VS Code, Render deployment, and Android WebView

### Technical Stack
- **Backend**: Flask, Python 3.11, Gunicorn
- **Frontend**: Bootstrap 5, Custom CSS animations, Vanilla JavaScript
- **OCR**: Tesseract with Pillow for image processing
- **TTS/STT**: Web Speech API with browser compatibility
- **Database**: PostgreSQL (ready for future user features)
- **Deployment**: Render-ready with proper configuration files

## User Preferences
- **Navigation**: Both "Back" and "Back to Homepage" buttons on all service pages
- **Design**: Modern, accessible design with enhanced visual feedback
- **Language Support**: Hindi and English with proper Braille conversion
- **Voice Features**: Google Assistant-style interface with professional animations
- **Cross-Platform**: Must work seamlessly across desktop, mobile, and WebView

## Recent Changes

### July 16, 2025 - Comprehensive TTS/STT Fixes & Android WebView Support
- ✅ Fixed Braille conversion API - now working properly with enhanced error handling
- ✅ Fixed speech recognition to automatically convert recognized text to Braille
- ✅ Added comprehensive Android WebView compatibility layer
- ✅ Enhanced Google Assistant-style voice modal with improved animations
- ✅ Implemented language-specific voice selection (English/Hindi) with fallback
- ✅ Added proper error handling for speech recognition failures
- ✅ Created Dockerfile for containerized deployment
- ✅ Enhanced cross-platform compatibility for APK building in Android Studio
- ✅ Added Android WebView JavaScript bridge for native speech integration
- ✅ Improved TTS functionality with start/stop toggle and visual feedback

### Previous Updates
- ✅ Complete Flask application structure with all core services
- ✅ Enhanced navigation system with back buttons and improved UX
- ✅ Fixed extracted text visibility issues in Image-to-Braille service
- ✅ Enhanced Hindi text processing with matra support
- ✅ Cross-platform deployment configuration (Render.yaml, Procfile, runtime.txt)
- ✅ Advanced TTS and STT features with Google Speech Recognition API

## Technical Details

### Speech Recognition Features
- Web Speech API integration with browser compatibility checks
- Google Assistant-style modal with animated pulse effects
- Language-specific recognition (English/Hindi) with proper locale settings
- Visual feedback during listening state with enhanced animations

### Text-to-Speech Features
- Advanced voice selection with language-specific preferences
- Fallback mechanisms for unsupported voices
- Toggle functionality (start/stop) with visual state indicators
- Enhanced button animations and user feedback

### Cross-Platform Compatibility
- Responsive design for desktop and mobile browsers
- Android WebView compatibility for APK conversion
- Proper port binding (0.0.0.0:5000) for deployment
- Environment variable configuration for production

## Deployment Configuration
- **Render**: render.yaml with proper build and start commands
- **Procfile**: Gunicorn configuration for Heroku-style deployment
- **Runtime**: Python 3.11 specified for consistent environment
- **Dependencies**: All required packages in pyproject.toml

## Next Steps
- Monitor user feedback on enhanced speech features
- Consider implementing user accounts for personalized settings
- Add offline capability for core Braille conversion features
- Explore PWA functionality for mobile app-like experience