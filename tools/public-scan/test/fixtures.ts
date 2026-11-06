import { randomBytes } from 'node:crypto';

// Fixtures entstehen erst zur Laufzeit: So enthält das Repo selbst keinen
// Text, den der Scan (oder GitHubs Push-Schutz) als echten Fund melden würde.

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randomBase62(length: number): string {
  return Array.from(randomBytes(length), (byte) => BASE62[byte % BASE62.length]).join('');
}

export const TEST_BLOCK_TERM = ['sperr', 'begriff', 'test', '4711'].join('-');

/** Inhalte, die der Scan melden muss (AK-2, AK-24). */
export const violations = {
  token: `const token = "${'ghp' + '_' + randomBase62(36)}";`,
  ipv4: `server: ${[185, 12, 64, 7].join('.')}`,
  ipv6: `server: ${['2a01', '4f8', 'c17', 'b8f', '0', '0', '0', '2'].join(':')}`,
  email: `Kontakt: ${['max', 'mustermann'].join('.')}@${['beispiel', 'firma'].join('-')}.de`,
  blockTerm: `Notiz: ${TEST_BLOCK_TERM} gehört nicht ins Repo`,
};

/** Inhalte, die der Scan durchlassen muss (keine Fehlalarme). */
export const allowed = {
  documentationIpv4: 'Beispiele: 192.0.2.10, 198.51.100.7, 203.0.113.5',
  localhost: 'ports: ["127.0.0.1:5432:5432"], listen 0.0.0.0',
  documentationIpv6: 'Beispiele: 2001:db8::1 und ::1',
  exampleEmail: 'Platzhalter: info@example.com, test@example.org',
  noreplyEmail: 'Commit-Adresse: 12345+name@users.noreply.github.com',
  versions: 'git 2.47.0, OpenTofu v1.13.1, Node 24.18.0',
};
