/**
 * Android WebView Bridge for Braille World
 * Provides compatibility layer for Android WebView speech recognition
 */

class AndroidWebViewBridge {
    constructor() {
        this.isAndroidWebView = this.detectAndroidWebView();
        this.setupAndroidInterface();
    }

    detectAndroidWebView() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isAndroid = /android/i.test(userAgent);
        const isWebView = /wv/i.test(userAgent);
        
        return isAndroid && (isWebView || typeof Android !== 'undefined');
    }

    setupAndroidInterface() {
        if (this.isAndroidWebView) {
            console.log('Android WebView detected, setting up speech bridge');
            
            // Request necessary permissions
            if (typeof Android !== 'undefined') {
                if (Android.requestSpeechPermission) {
                    Android.requestSpeechPermission();
                }
                
                if (Android.requestMicrophonePermission) {
                    Android.requestMicrophonePermission();
                }
            }
        }
    }

    startSpeechRecognition(language = 'en-US') {
        if (this.isAndroidWebView && typeof Android !== 'undefined') {
            try {
                const locale = language === 'hi-IN' ? 'hi-IN' : 'en-US';
                
                if (Android.startSpeechRecognition) {
                    Android.startSpeechRecognition(locale);
                    return true;
                }
            } catch (error) {
                console.error('Android speech recognition error:', error);
                return false;
            }
        }
        return false;
    }

    stopSpeechRecognition() {
        if (this.isAndroidWebView && typeof Android !== 'undefined') {
            try {
                if (Android.stopSpeechRecognition) {
                    Android.stopSpeechRecognition();
                }
            } catch (error) {
                console.error('Android speech stop error:', error);
            }
        }
    }

    playTextToSpeech(text, language = 'en-US') {
        if (this.isAndroidWebView && typeof Android !== 'undefined') {
            try {
                const locale = language === 'hi-IN' ? 'hi-IN' : 'en-US';
                
                if (Android.playTextToSpeech) {
                    Android.playTextToSpeech(text, locale);
                    return true;
                }
            } catch (error) {
                console.error('Android TTS error:', error);
                return false;
            }
        }
        return false;
    }

    stopTextToSpeech() {
        if (this.isAndroidWebView && typeof Android !== 'undefined') {
            try {
                if (Android.stopTextToSpeech) {
                    Android.stopTextToSpeech();
                }
            } catch (error) {
                console.error('Android TTS stop error:', error);
            }
        }
    }

    showToast(message) {
        if (this.isAndroidWebView && typeof Android !== 'undefined') {
            try {
                if (Android.showToast) {
                    Android.showToast(message);
                }
            } catch (error) {
                console.error('Android toast error:', error);
            }
        }
    }

    vibrate(duration = 100) {
        if (this.isAndroidWebView && typeof Android !== 'undefined') {
            try {
                if (Android.vibrate) {
                    Android.vibrate(duration);
                }
            } catch (error) {
                console.error('Android vibrate error:', error);
            }
        }
    }
}

// Initialize Android WebView Bridge
const androidBridge = new AndroidWebViewBridge();

// Export for use in other scripts
window.androidBridge = androidBridge;