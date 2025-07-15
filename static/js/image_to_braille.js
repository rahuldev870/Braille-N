/**
 * Enhanced Image to Braille Converter with microphone support and client-side TTS
 * Supports: Chrome, Android WebView, Hindi/English TTS and Speech Recognition
 */

class ImageToBrailleConverter {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.uploadPrompt = document.getElementById('uploadPrompt');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImg = document.getElementById('previewImg');
        this.fileName = document.getElementById('fileName');
        this.processBtn = document.getElementById('processBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.resultsSection = document.getElementById('resultsSection');
        this.extractedText = document.getElementById('extractedText');
        this.readExtractedBtn = document.getElementById('readExtractedBtn');
        this.brailleOutput = document.getElementById('brailleOutput');
        this.characterMapping = document.getElementById('characterMapping');
        this.mappingDisplay = document.getElementById('mappingDisplay');
        this.errorDisplay = document.getElementById('errorDisplay');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Add microphone elements
        this.micButton = this.createMicrophoneButton();
        this.voiceStatus = this.createVoiceStatusElement();
        
        // Language and speech support
        this.currentLanguage = 'english';
        this.recognition = null;
        this.isListening = false;
        
        // TTS systems
        this.synth = window.speechSynthesis;
        this.isAndroidWebView = this.detectAndroidWebView();
        this.selectedFile = null;
        
        this.initializeEvents();
        this.setupSpeechRecognition();
        this.setupLanguageSelector();
    }
    
    /**
     * Detect if running in Android WebView
     */
    detectAndroidWebView() {
        return typeof window.AndroidInterface !== 'undefined' && 
               typeof window.AndroidInterface.speakText === 'function';
    }
    
    /**
     * Create microphone button for voice input
     */
    createMicrophoneButton() {
        const micButton = document.createElement('button');
        micButton.type = 'button';
        micButton.className = 'btn btn-outline-primary';
        micButton.innerHTML = '<i class="fas fa-microphone"></i>';
        micButton.title = 'Click to add text by voice';
        micButton.id = 'micButton';
        
        // Add microphone button to the upload area
        const uploadArea = document.getElementById('uploadArea');
        const micContainer = document.createElement('div');
        micContainer.className = 'mt-3';
        micContainer.innerHTML = `
            <hr class="my-3">
            <div class="text-center">
                <p class="mb-2"><strong>Or add text by voice:</strong></p>
            </div>
        `;
        micContainer.appendChild(micButton);
        uploadArea.appendChild(micContainer);
        
        return micButton;
    }
    
    /**
     * Create voice status element
     */
    createVoiceStatusElement() {
        const voiceStatus = document.createElement('div');
        voiceStatus.id = 'voiceStatus';
        voiceStatus.className = 'alert alert-info d-none mt-3';
        voiceStatus.innerHTML = '<i class="fas fa-microphone-alt me-2"></i><span id="voiceStatusText">Ready to listen...</span>';
        
        // Add after upload area
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.parentNode.insertBefore(voiceStatus, uploadArea.nextSibling);
        
        return voiceStatus;
    }
    
    /**
     * Initialize event listeners
     */
    initializeEvents() {
        // Upload area events
        this.uploadArea.addEventListener('click', (e) => {
            if (e.target === this.micButton || this.micButton.contains(e.target)) {
                this.toggleVoiceRecognition();
            } else {
                this.imageInput.click();
            }
        });
        
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // File input change
        this.imageInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Process button
        this.processBtn.addEventListener('click', () => this.processImage());
        
        // Read aloud button
        this.readExtractedBtn.addEventListener('click', () => this.readExtractedText());
        
        // Microphone button
        this.micButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleVoiceRecognition();
        });
    }
    
    /**
     * Setup language selector
     */
    setupLanguageSelector() {
        const languageRadios = document.querySelectorAll('input[name="language"]');
        languageRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.currentLanguage = radio.value;
                this.updateSpeechRecognitionLanguage();
            });
        });
        
        // Set initial language
        const checkedRadio = document.querySelector('input[name="language"]:checked');
        if (checkedRadio) {
            this.currentLanguage = checkedRadio.value;
        }
    }
    
    /**
     * Setup speech recognition with multi-language support
     */
    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.updateSpeechRecognitionLanguage();
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateMicButton();
                this.showVoiceStatus('Listening... Speak now to add text!');
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    this.processVoiceInput(finalTranscript);
                    this.showVoiceStatus('Voice input processed!', 'success');
                } else {
                    this.showVoiceStatus(`Listening... "${interimTranscript}"`);
                }
            };
            
            this.recognition.onerror = (event) => {
                this.isListening = false;
                this.updateMicButton();
                let errorMessage = 'Voice recognition error';
                
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Try again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone not available.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone permission denied.';
                        break;
                    case 'network':
                        errorMessage = 'Network error. Check connection.';
                        break;
                    default:
                        errorMessage = `Error: ${event.error}`;
                }
                
                this.showVoiceStatus(errorMessage, 'danger');
                setTimeout(() => this.hideVoiceStatus(), 3000);
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateMicButton();
                setTimeout(() => this.hideVoiceStatus(), 2000);
            };
        } else {
            this.micButton.disabled = true;
            this.micButton.title = 'Voice recognition not supported in this browser';
        }
    }
    
    /**
     * Update speech recognition language
     */
    updateSpeechRecognitionLanguage() {
        if (this.recognition) {
            this.recognition.lang = this.currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';
        }
    }
    
    /**
     * Toggle voice recognition
     */
    toggleVoiceRecognition() {
        if (!this.recognition) return;
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            // Request microphone permission for Android WebView
            if (this.isAndroidWebView && typeof window.AndroidInterface.requestMicrophonePermission === 'function') {
                window.AndroidInterface.requestMicrophonePermission();
            }
            this.recognition.start();
        }
    }
    
    /**
     * Process voice input as text
     */
    async processVoiceInput(text) {
        try {
            const response = await fetch('/api/convert-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    language: this.currentLanguage
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayVoiceResults(data.original_text, data.braille_text);
            } else {
                this.showError(data.error || 'Failed to convert voice input');
            }
        } catch (error) {
            console.error('Voice processing error:', error);
            this.showError('Failed to process voice input. Please try again.');
        }
    }
    
    /**
     * Display voice input results
     */
    displayVoiceResults(originalText, brailleText) {
        // Clear any placeholder text and display voice input
        this.extractedText.innerHTML = '';
        this.extractedText.style.color = '#212529';
        this.extractedText.style.fontWeight = '500';
        this.extractedText.textContent = originalText;
        this.readExtractedBtn.disabled = false;
        
        // Display Braille output
        this.brailleOutput.innerHTML = `<span class="braille-text" style="color: #007bff; font-size: 24px; font-weight: bold;">${brailleText}</span>`;
        
        // Show character mapping
        this.displayCharacterMapping(originalText, brailleText);
        
        // Show results section
        this.resultsSection.classList.remove('d-none');
        
        // Add voice input indicator
        const voiceIndicator = document.createElement('small');
        voiceIndicator.className = 'text-muted d-block';
        voiceIndicator.innerHTML = '<i class="fas fa-microphone me-1"></i>Voice input';
        this.extractedText.appendChild(voiceIndicator);
    }
    
    /**
     * Update microphone button appearance
     */
    updateMicButton() {
        if (this.isListening) {
            this.micButton.classList.add('btn-danger');
            this.micButton.classList.remove('btn-outline-primary');
            this.micButton.innerHTML = '<i class="fas fa-stop"></i>';
            this.micButton.title = 'Click to stop listening';
        } else {
            this.micButton.classList.remove('btn-danger');
            this.micButton.classList.add('btn-outline-primary');
            this.micButton.innerHTML = '<i class="fas fa-microphone"></i>';
            this.micButton.title = 'Click to add text by voice';
        }
    }
    
    /**
     * Show voice status message
     */
    showVoiceStatus(message, type = 'info') {
        const statusText = document.getElementById('voiceStatusText');
        if (statusText) {
            statusText.textContent = message;
        }
        this.voiceStatus.className = `alert alert-${type} mt-3`;
        this.voiceStatus.classList.remove('d-none');
    }
    
    /**
     * Hide voice status message
     */
    hideVoiceStatus() {
        this.voiceStatus.classList.add('d-none');
    }
    
    /**
     * Handle drag over event
     */
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('border-primary');
    }
    
    /**
     * Handle drop event
     */
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('border-primary');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }
    
    /**
     * Handle file selection
     */
    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }
    
    /**
     * Handle file validation and preview
     */
    handleFile(file) {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/tiff'];
        if (!allowedTypes.includes(file.type)) {
            this.showError('Invalid file type. Please upload an image file.');
            return;
        }
        
        // Validate file size (16MB)
        if (file.size > 16 * 1024 * 1024) {
            this.showError('File too large. Maximum size is 16MB.');
            return;
        }
        
        this.selectedFile = file;
        this.showImagePreview(file);
        this.processBtn.disabled = false;
        this.hideError();
        this.hideResults();
    }
    
    /**
     * Show image preview
     */
    showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImg.src = e.target.result;
            this.fileName.textContent = file.name;
            this.uploadPrompt.classList.add('d-none');
            this.imagePreview.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * Process uploaded image
     */
    async processImage() {
        if (!this.selectedFile) return;
        
        this.showLoading();
        this.hideError();
        this.hideResults();
        
        const formData = new FormData();
        formData.append('image', this.selectedFile);
        formData.append('language', this.currentLanguage);
        
        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayResults(data);
            } else {
                this.showError(data.error || 'Failed to process image');
            }
        } catch (error) {
            console.error('Processing error:', error);
            this.showError('Failed to process image. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    /**
     * Display image processing results
     */
    displayResults(data) {
        // Clear any placeholder text and display extracted text with proper styling
        this.extractedText.innerHTML = '';
        this.extractedText.style.color = '#212529';
        this.extractedText.style.fontWeight = '500';
        this.extractedText.textContent = data.extracted_text;
        this.readExtractedBtn.disabled = false;
        
        // Display Braille output with enhanced visibility
        this.brailleOutput.innerHTML = `<span class="braille-text" style="color: #007bff; font-size: 24px; font-weight: bold;">${data.braille_text}</span>`;
        
        // Show character mapping
        this.displayCharacterMapping(data.extracted_text, data.braille_text);
        
        // Show results section
        this.resultsSection.classList.remove('d-none');
    }
    
    /**
     * Display character mapping
     */
    displayCharacterMapping(originalText, brailleText) {
        let mappingHtml = '';
        for (let i = 0; i < Math.min(originalText.length, brailleText.length); i++) {
            const char = originalText[i];
            const braille = brailleText[i];
            mappingHtml += `
                <div class="mapping-pair d-inline-block text-center me-3 mb-2">
                    <div class="braille-char">${braille}</div>
                    <div class="text-char">${char === ' ' ? '⎵' : char}</div>
                </div>
            `;
        }
        this.mappingDisplay.innerHTML = mappingHtml;
    }
    
    /**
     * Enhanced Text-to-Speech with multiple fallback systems
     */
    async readExtractedText() {
        const text = this.extractedText.textContent.trim();
        if (!text) return;
        
        // Stop any ongoing speech
        this.stopSpeech();
        
        const language = this.currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';
        
        // Try Android WebView interface first
        if (this.isAndroidWebView) {
            try {
                window.AndroidInterface.speakText(text, language);
                this.updateReadAloudButton(true);
                return;
            } catch (error) {
                console.warn('Android TTS failed, falling back to web APIs:', error);
            }
        }
        
        // Try Edge TTS (Microsoft Azure Speech SDK) if available
        if (typeof speechSynthesis !== 'undefined' && this.tryEdgeTTS(text, language)) {
            return;
        }
        
        // Fallback to Web Speech API
        this.useWebSpeechTTS(text, language);
    }
    
    /**
     * Try Edge TTS implementation
     */
    tryEdgeTTS(text, language) {
        // Edge TTS would require the Microsoft Cognitive Services Speech SDK
        // For now, this is a placeholder for future implementation
        return false;
    }
    
    /**
     * Use Web Speech API for TTS
     */
    useWebSpeechTTS(text, language) {
        if (!this.synth) {
            this.showError('Text-to-speech not supported in this browser');
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
            this.updateReadAloudButton(true);
        };
        
        utterance.onend = () => {
            this.updateReadAloudButton(false);
        };
        
        utterance.onerror = (event) => {
            console.error('TTS error:', event.error);
            this.updateReadAloudButton(false);
            this.showError('Text-to-speech failed. Please try again.');
        };
        
        this.synth.speak(utterance);
    }
    
    /**
     * Stop all speech synthesis
     */
    stopSpeech() {
        // Stop Web Speech API
        if (this.synth) {
            this.synth.cancel();
        }
        
        // Stop Android WebView TTS
        if (this.isAndroidWebView && typeof window.AndroidInterface.stopSpeech === 'function') {
            window.AndroidInterface.stopSpeech();
        }
        
        this.updateReadAloudButton(false);
    }
    
    /**
     * Update read aloud button state
     */
    updateReadAloudButton(isSpeaking) {
        if (isSpeaking) {
            this.readExtractedBtn.disabled = true;
            this.readExtractedBtn.innerHTML = '<i class="fas fa-stop me-2"></i>Speaking...';
        } else {
            this.readExtractedBtn.disabled = false;
            this.readExtractedBtn.innerHTML = '<i class="fas fa-volume-up me-2"></i>Read Aloud';
        }
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        this.loadingSpinner.classList.remove('d-none');
        this.processBtn.disabled = true;
    }
    
    /**
     * Hide loading state
     */
    hideLoading() {
        this.loadingSpinner.classList.add('d-none');
        this.processBtn.disabled = false;
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorDisplay.classList.remove('d-none');
    }
    
    /**
     * Hide error message
     */
    hideError() {
        this.errorDisplay.classList.add('d-none');
    }
    
    /**
     * Hide results section
     */
    hideResults() {
        this.resultsSection.classList.add('d-none');
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ImageToBrailleConverter();
});