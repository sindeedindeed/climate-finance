import React, { useEffect } from "react";

const LanguageSwitcher = () => {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'bn,en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
        'google_translate_element'
      );
    };

    if (document.getElementById('google-translate-script')) {
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    } else {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1000, background: 'white', borderRadius: '9999px', padding: '2px 12px', minWidth: 120, display: 'flex', alignItems: 'center' }}>
      <div id="google_translate_element" style={{ minWidth: 100 }}></div>
      <style>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-gadget-simple {
          background-color: #f8f8f8 !important;
          border: 1px solid #ddd !important;
          border-radius: 5px !important;
          padding: 10px !important;
          font-family: Arial, sans-serif !important;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value {
          color: #333 !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span {
          display: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value:hover {
          background-color: #e2e2e2 !important;
        }
        .goog-te-gadget-simple .goog-te-menu2 {
          max-width: none !important;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;