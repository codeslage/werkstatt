import { describe, expect, it } from 'vitest';
import { CONTACT_ADDRESS, contactMailto } from '../src/site/contact.ts';

// AK-3: Der Mail-Link geht an die freigegebene Rollenadresse; der Betreff ist korrekt kodiert.

describe('contactMailto', () => {
  it('richtet sich an die Rollenadresse', () => {
    expect(CONTACT_ADDRESS).toBe('kontakt@codeslage.de');
    expect(contactMailto.startsWith(`mailto:${CONTACT_ADDRESS}?`)).toBe(true);
  });

  it('kodiert den Betreff', () => {
    const subject = new URL(contactMailto).searchParams.get('subject');
    expect(subject).toBe('Anfrage über codeslage.de');
    expect(contactMailto).not.toContain(' ');
  });
});
