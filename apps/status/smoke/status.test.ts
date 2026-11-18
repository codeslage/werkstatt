import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseHealth } from '../src/health-schema.ts';

// Smoke-Test gegen die laufende lokale Umgebung (`pnpm dev:up`), AK-25 und AK-26.
// Läuft lokal und im CI-Job `image`; braucht Docker und Netz (Registry für die Digest-Prüfung).

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:3000';

function docker(args: string[]): string {
  const result = spawnSync('docker', args, { cwd: REPO_ROOT, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`docker ${args.join(' ')}: ${result.stderr || result.error?.message}`);
  return result.stdout;
}

interface Container {
  Id: string;
  Config: { Labels: Record<string, string> };
  State: { Health?: { Status: string } };
  NetworkSettings: { Ports: Record<string, { HostIp: string; HostPort: string }[] | null> };
}

// Direkt über das Compose-Label statt `docker compose`: braucht keine Variablen aus .env.
function containers(): Container[] {
  const ids = docker(['ps', '-q', '--filter', 'label=com.docker.compose.project=codeslage'])
    .split('\n')
    .filter(Boolean);
  if (ids.length === 0) throw new Error('Keine laufenden Container – zuerst `pnpm dev:up`');
  return JSON.parse(docker(['inspect', ...ids])) as Container[];
}

const serviceOf = (c: Container) => c.Config.Labels['com.docker.compose.service'] ?? '';

describe('lokale Umgebung (AK-25, AK-26)', () => {
  it('/health meldet ok und entspricht dem Schema', async () => {
    const response = await fetch(`${BASE}/health`);
    expect(response.status).toBe(200);
    expect(parseHealth(await response.json())).toMatchObject({ status: 'ok', db: 'ok' });
  });

  it('/ liefert die Startseite', async () => {
    const response = await fetch(`${BASE}/`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('Hello codeslage');
  });

  it('beide Dienste laufen und sind gesund (HEALTHCHECK bzw. pg_isready)', () => {
    const health = Object.fromEntries(containers().map((c) => [serviceOf(c), c.State.Health?.Status]));
    expect(health).toEqual({ db: 'healthy', status: 'healthy' });
  });

  it('veröffentlicht Ports nur auf 127.0.0.1', () => {
    const bindings = containers().flatMap((c) => Object.values(c.NetworkSettings.Ports).flatMap((b) => b ?? []));
    expect(bindings.length).toBeGreaterThan(0);
    for (const binding of bindings) expect(binding.HostIp).toBe('127.0.0.1');
  });

  it('die App läuft nicht als root', () => {
    const status = containers().find((c) => serviceOf(c) === 'status');
    if (!status) throw new Error('Container „status“ läuft nicht');
    expect(docker(['exec', status.Id, 'id', '-u']).trim()).not.toBe('0');
  });
});

describe('Basis-Images (Plan v1.2: arm64 lokal, amd64 in der CI)', () => {
  const pinned = [
    ...readFileSync(join(REPO_ROOT, 'apps/status/Dockerfile'), 'utf8').matchAll(/^FROM\s+(\S+)/gm),
    ...readFileSync(join(REPO_ROOT, 'compose.yaml'), 'utf8').matchAll(/^\s+image:\s+(\S+)/gm),
  ].map((match) => match[1] ?? '');

  it('sind per Digest gepinnt', () => {
    expect(pinned.length).toBeGreaterThan(0);
    for (const ref of pinned) expect(ref).toMatch(/@sha256:[0-9a-f]{64}$/);
  });

  it.each(pinned)('%s ist eine Manifest-Liste mit amd64 und arm64', (ref) => {
    const raw = docker(['buildx', 'imagetools', 'inspect', ref, '--raw']);
    const platforms = (
      JSON.parse(raw) as { manifests?: { platform?: { os: string; architecture: string } }[] }
    ).manifests?.map((m) => `${m.platform?.os}/${m.platform?.architecture}`);
    expect(platforms).toEqual(expect.arrayContaining(['linux/amd64', 'linux/arm64']));
  });
});
