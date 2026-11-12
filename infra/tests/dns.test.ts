import { Resolver } from 'node:dns/promises';
import { isIP } from 'node:net';
import { beforeAll, describe, expect, it } from 'vitest';

// AK-3: MX zeigt auf Google, SPF, DKIM und DMARC sind vorhanden.
// DNS_SERVER wählt den Nameserver (Name oder IP). Standard ist ein öffentlicher Resolver.
// Vor dem Umzug (T-38) wird damit gezielt gegen die Cloudflare-Nameserver geprüft, danach gegen die öffentliche Auflösung.

const DOMAIN = 'codeslage.de';
const server = process.env.DNS_SERVER ?? '1.1.1.1';
const resolver = new Resolver();

beforeAll(async () => {
  const ip = isIP(server) ? server : ((await new Resolver().resolve4(server))[0] ?? '');
  if (ip === '') throw new Error(`Nameserver ${server} lässt sich nicht auflösen`);
  resolver.setServers([ip]);
});

const txt = async (name: string): Promise<string[]> => (await resolver.resolveTxt(name)).map((parts) => parts.join(''));

describe(`DNS von ${DOMAIN} über ${server} (AK-3)`, () => {
  it('MX zeigt auf Google', async () => {
    const exchanges = (await resolver.resolveMx(DOMAIN)).map((mx) => mx.exchange.toLowerCase());
    expect(exchanges).toContain('smtp.google.com');
  });

  it('SPF erlaubt Google', async () => {
    expect(await txt(DOMAIN)).toContainEqual(expect.stringMatching(/^v=spf1 .*include:_spf\.google\.com/));
  });

  it('DKIM von Google ist veröffentlicht', async () => {
    expect(await txt(`google._domainkey.${DOMAIN}`)).toContainEqual(expect.stringMatching(/^v=DKIM1;/));
  });

  it('DMARC ist vorhanden', async () => {
    expect(await txt(`_dmarc.${DOMAIN}`)).toContainEqual(expect.stringMatching(/^v=DMARC1;/));
  });
});
