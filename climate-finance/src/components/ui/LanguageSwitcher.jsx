'use client'; // Add this if using Next.js App Router

import React, { useEffect, useState } from "react";
import Button from "./Button";

const LanguageSwitcher = () => {
    const [language, setLanguage] = useState("en");
    const [isGoogleTranslateLoaded, setIsGoogleTranslateLoaded] = useState(false);

    useEffect(() => {
        // Get language from cookie with improved parsing
        const getCookieValue = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };
        
        const googtransCookie = getCookieValue('googtrans');
        const currentLang = googtransCookie ? googtransCookie.split('/')[2] || "en" : "en";
        setLanguage(currentLang);

        // Check if Google Translate is already loaded
        if (window.google && window.google.translate) {
            setIsGoogleTranslateLoaded(true);
            return;
        }

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
            setIsGoogleTranslateLoaded(true);
        };

        // Load script dynamically with HTTPS for production
        if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src =
                "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "bn" : "en";

        // Fix domain logic for Vercel and other deployments
        const hostname = window.location.hostname;
        const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
        
        // Get appropriate domain for cookie - simplified for Vercel
        const getCookieDomain = () => {
            if (isLocalhost) return null; // No domain for localhost
            
            // For Vercel deployments, don't set domain at all to avoid cross-domain issues
            if (hostname.includes('.vercel.app')) {
                return null; // Let browser handle domain automatically
            }
            
            // For custom domains
            const parts = hostname.split('.');
            if (parts.length <= 2) {
                return null; // Let browser handle simple domains
            } else {
                return "." + parts.slice(-2).join(".");
            }
        };
        
        const cookieDomain = getCookieDomain();
        
        // Debug logging
        console.log('Language toggle debug:', {
            hostname,
            cookieDomain,
            newLang,
            currentCookie: document.cookie
        });
        
        // Debug logging for Vercel deployment
        console.log('Language toggle debug:', {
            hostname,
            cookieDomain,
            newLang,
            currentCookie: document.cookie
        });
        
        // Set or clear translation cookie with proper format
        if (newLang === "en") {
            // Clear cookie - try multiple approaches for Vercel
            document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            if (cookieDomain) {
                document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${cookieDomain}`;
            }
            // Also try to clear with SameSite for Vercel
            document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        } else {
            // Set cookie - try multiple approaches for Vercel
            document.cookie = `googtrans=/en/${newLang}; path=/`;
            if (cookieDomain) {
                document.cookie = `googtrans=/en/${newLang}; path=/; domain=${cookieDomain}`;
            }
            // Also try to set with SameSite for Vercel
            document.cookie = `googtrans=/en/${newLang}; path=/; SameSite=Lax`;
        }
        
        // Debug: Check if cookie was actually set
        console.log('Cookie after setting:', document.cookie);

        setLanguage(newLang);
        
        // Try to trigger translation programmatically if Google Translate is loaded
        if (isGoogleTranslateLoaded && window.google && window.google.translate) {
            const translateElement = window.google.translate.TranslateElement;
            if (translateElement) {
                // Trigger immediate translation if possible
                setTimeout(() => {
                    window.location.reload();
                }, 50);
                return;
            }
        }
        
        // Fallback: reload page with small delay to ensure cookie setting
        setTimeout(() => {
            window.location.reload();
        }, 100);
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
