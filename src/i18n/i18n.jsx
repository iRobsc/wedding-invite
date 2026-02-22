import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';

// Global language variable — allows rbt() to work without hooks
let currentLanguage = 'sv';

/**
 * Translate an English string to the current language.
 * Usage: rbt("Hello") → "Hej" (if lang=sv)
 * 
 * If no translation exists, returns the English string as-is.
 */
export function rbt(englishString) {
    if (currentLanguage === 'en') return englishString;

    const entry = translations[englishString];
    if (entry && entry[currentLanguage]) {
        return entry[currentLanguage];
    }
    // Fallback to English if no translation found
    return englishString;
}

// Context for components that need to re-render on language change
const LanguageContext = createContext('sv');

export function useLanguage() {
    return useContext(LanguageContext);
}

/**
 * LanguageProvider — reads ?lang= from the URL and sets the global language.
 * Wrap your app tree with this component.
 */
export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        return urlLang || 'sv';
    });

    // Set the global variable on mount and when lang changes
    useEffect(() => {
        currentLanguage = lang;

        // Redirect to ?lang=sv if no lang param is present
        const params = new URLSearchParams(window.location.search);
        if (!params.get('lang')) {
            params.set('lang', 'sv');
            window.location.replace(`${window.location.pathname}?${params.toString()}${window.location.hash}`);
        }
    }, [lang]);

    // Also set it synchronously for the initial render
    currentLanguage = lang;

    return (
        <LanguageContext.Provider value={lang}>
            {children}
        </LanguageContext.Provider>
    );
}

/**
 * ShowOnlyForLang — conditionally renders children only for a specific language.
 * Usage: <ShowOnlyForLang lang="sv">Swedish-only content</ShowOnlyForLang>
 */
export function ShowOnlyForLang({ lang, children }) {
    const currentLang = useContext(LanguageContext);
    if (currentLang !== lang) return null;
    return <>{children}</>;
}
