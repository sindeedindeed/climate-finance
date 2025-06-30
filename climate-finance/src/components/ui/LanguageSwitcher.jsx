import React, { useEffect, useState } from "react";
import Button from "./Button";

const LanguageSwitcher = () => {
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        // Detect current language from cookie with improved regex
        const cookieMatch = document.cookie.match(/googtrans=\/en\/(\w+)/);
        const currentLang = cookieMatch?.[1] || "en";
        setLanguage(currentLang);

        // Google Translate init function
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "bn,en",
                    layout: window.google.translate.TranslateElement
                        .InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                "google_translate_element"
            );
        };

        // Load script if not already present
        if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        } else if (window.google && window.google.translate) {
            window.googleTranslateElementInit();
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "bn" : "en";
        
        if (newLang === "en") {
            // Remove the translation cookie when switching back to English
            document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + window.location.hostname;
        } else {
            // Set the translation cookie for Bangla
            document.cookie = `googtrans=/en/${newLang};path=/;domain=${window.location.hostname}`;
        }
        
        setLanguage(newLang);
        window.location.reload(); // Reload required for Google Translate to apply
    };

    return (
        <div className="relative z-[1000] min-w-[100px] flex items-center">
            <Button
                className="w-full"
                onClick={toggleLanguage}
                children={language === "en" ? "English" : "Bangla"}
                leftIcon={"⇆"}
            />

            {/* Hidden Google Translate container */}
            <div
                id="google_translate_element"
                style={{ display: "none" }}
            ></div>

            {/* Style overrides to prevent banner overlay */}
            <style>{`
        .goog-te-banner-frame {
          display: none !important;
          height: 0 !important;
          visibility: hidden !important;
        }

        body {
          top: 0px !important;
          position: static !important;
        }

        .skiptranslate {
          display: none !important;
        }

        .goog-te-gadget {
          font-size: 0 !important;
        }

        .goog-logo-link {
          display: none !important;
        }
      `}</style>
        </div>
    );
};

export default LanguageSwitcher;
