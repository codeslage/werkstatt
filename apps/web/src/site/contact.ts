// Öffentliche Rollenadresse (Spec 06, Frage 6; Ausnahme im Öffentlich-Scan in .gitleaks.toml). Einzige Quelle
// für Kontaktseite und Tests (AK-3).
export const CONTACT_ADDRESS = 'kontakt@codeslage.de';

export const contactMailto = `mailto:${CONTACT_ADDRESS}?subject=${encodeURIComponent('Anfrage über codeslage.de')}`;
