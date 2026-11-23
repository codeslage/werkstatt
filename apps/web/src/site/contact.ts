// Öffentliche Rollenadresse (Spec 06, Frage 6; Ausnahme im Öffentlich-Scan in .gitleaks.toml). Einzige Quelle
// für die Seite; die Tests prüfen bewusst gegen den festen Wert (AK-3). Die Beschreibung in pages.ts nennt die
// Adresse zusätzlich als Text.
export const CONTACT_ADDRESS = 'kontakt@codeslage.de';

export const contactMailto = `mailto:${CONTACT_ADDRESS}?subject=${encodeURIComponent('Anfrage über codeslage.de')}`;

// Öffentliche Buchungsseite für ein Erstgespräch (Google Kalender, Terminplan). Nur verlinkt, nicht eingebettet:
// Die Webseite lädt nichts von Google (AK-4); Daten gehen erst bei einer Buchung an Google (Datenschutz, T-17).
export const BOOKING_URL = 'https://calendar.app.google/AoVREVhD3FnqSuMN7';
