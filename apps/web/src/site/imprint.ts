// Impressumsangaben stehen nicht im öffentlichen Repo (Spec, Frage 4). Sie kommen beim Build aus der Umgebung
// (lokal `.env`, im Deploy GitHub-Environment `production`) und werden hier geprüft (Constitution VII).
// Ungültiges bricht den Build ab; die Meldung nennt nur die Variable, nie den Wert (XVI, keine Daten im Log).

export interface Imprint {
  readonly name: string;
  readonly street: string;
  readonly postalCodeCity: string;
}

const FIELDS = {
  name: 'IMPRESSUM_NAME',
  street: 'IMPRESSUM_STRASSE',
  postalCodeCity: 'IMPRESSUM_PLZ_ORT',
} as const satisfies Record<keyof Imprint, string>;

const MAX_LENGTH = 100;
// Steuerzeichen (C0 und DEL) haben in einer Anschriftzeile nichts zu suchen.
// eslint-disable-next-line no-control-regex -- genau diese Zeichen sollen erkannt werden
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;

function isValid(value: string | undefined): value is string {
  if (value === undefined) return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !CONTROL_CHARACTERS.test(value);
}

export function readImprint(env: Readonly<Record<string, string | undefined>>): Imprint {
  const invalid = Object.values(FIELDS).filter((variable) => !isValid(env[variable]));
  if (invalid.length > 0) {
    throw new Error(
      `Impressumsangaben fehlen oder sind ungültig (Pflicht, höchstens ${MAX_LENGTH} Zeichen, keine Steuerzeichen): ${invalid.join(', ')}`,
    );
  }
  const read = (variable: string): string => (env[variable] ?? '').trim();
  return { name: read(FIELDS.name), street: read(FIELDS.street), postalCodeCity: read(FIELDS.postalCodeCity) };
}
