'use client'; // Add this if using Next.js App Router

import React, { useEffect, useState } from "react";
import Button from "./Button";

const LanguageSwitcher = () => {
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        // Get language from cookie
        const cookieMatch = document.cookie.match(/googtrans=\/en\/(\w+)/);
        const currentLang = cookieMatch?.[1] || "en";
        setLanguage(currentLang);

        // Define the global init function BEFORE loading the script
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "bn,en",
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                "google_translate_element"
            );
        };

        // Load script dynamically
        if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "bn" : "en";

        // Use proper domain for deployed environments
        const domain = window.location.hostname.includes("localhost")
            ? "localhost"
            : "." + window.location.hostname.split(".").slice(-2).join(".");

        // Set or clear translation cookie
        if (newLang === "en") {
            document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}`;
        } else {
            document.cookie = `googtrans=/en/${newLang}; path=/; domain=${domain}`;
        }

        setLanguage(newLang);
        window.location.reload(); // Required for translate to reapply
    };

    return (
        <div
            className={`relative z-[1000] min-w-[100px] flex items-center ${
                language === "bn" ? "noto-sans-bengali" : ""
            }`}
        >
            <Button
                className="w-full"
                onClick={toggleLanguage}
                leftIcon="⇆"
            >
                {language === "en" ? "English" : "বাংলা"}
            </Button>

            {/* Hidden Google Translate element */}
            <div id="google_translate_element" style={{ display: "none" }}></div>

            {/* Force-hide unwanted Google Translate UI elements */}
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
