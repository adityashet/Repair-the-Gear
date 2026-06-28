/**
 * theme.js — Auto Day/Night Theme for Repair The Gear
 * Reads real India Standard Time (IST = UTC+5:30)
 * Day  (06:00 – 17:59 IST) → light-theme
 * Night(18:00 – 05:59 IST) → dark theme (default)
 */

// Google Maps styles
window.DARK_MAP_STYLES = [
    { elementType: "geometry", stylers: [{ color: "#1a2035" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0B1120" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#243050" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a2035" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c3e6b" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0B1120" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
];

window.LIGHT_MAP_STYLES = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0e0e0" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#b3b3b3" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d8e8" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5f5e0" }] }
];

(function applyTheme() {
    // Get current IST hour (UTC + 5:30)
    function getISTHour() {
        const now = new Date();
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        const istDate = new Date(utcMs + 330 * 60000); // IST = UTC+5:30
        return istDate.getHours();
    }

    function setTheme() {
        const pref = localStorage.getItem('themePref') || 'auto';

        let isDay;
        if (pref === 'light') {
            isDay = true;
        } else if (pref === 'dark') {
            isDay = false;
        } else {
            // Auto: Day 6am–6pm IST
            const hour = getISTHour();
            isDay = hour >= 6 && hour < 18;
        }

        window.__isLightTheme = isDay;

        if (isDay) {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }

        // If a map page has registered a theme update callback, call it
        if (typeof window.onThemeChange === 'function') {
            window.onThemeChange(isDay);
        }
    }

    // Apply as soon as body exists
    if (document.body) {
        setTheme();
    } else {
        document.addEventListener('DOMContentLoaded', setTheme);
    }

    // Re-check every 60 seconds so the switch is timely
    setInterval(setTheme, 60 * 1000);

    // Expose so profile.html can trigger a re-check immediately after saving pref
    window.__applyTheme = setTheme;
})();
