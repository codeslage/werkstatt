// Öffentliche Rollenadresse (Spec 06, Frage 6; Ausnahme im Öffentlich-Scan in .gitleaks.toml). Einzige Quelle
// für die Seite; die Tests prüfen bewusst gegen den festen Wert (AK-3). Die Beschreibung in pages.ts nennt die
// Adresse zusätzlich als Text.
export const CONTACT_ADDRESS = 'kontakt@codeslage.de';

export const contactMailto = `mailto:${CONTACT_ADDRESS}?subject=${encodeURIComponent('Anfrage über codeslage.de')}`;
