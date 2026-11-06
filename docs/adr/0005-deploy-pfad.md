# ADR 0005 – Deploy-Pfad: GitHub Actions → GHCR → Coolify

> Status: **Vertagt** bis Phase S (ADR 0009) · Stand: 2026-11-05
> Bezug: `docs/prozess/release.md`, `specs/04-fundament/spec.md` (AK-21, AK-22, AK-23), ADR 0003

## Kontext

- dev soll jedem Merge nach `main` automatisch folgen (AK-21).
- int und prod sollen **dasselbe Image** bekommen (AK-22), prod nur nach Freigabe (AK-23).
- Coolify ist nicht öffentlich erreichbar (AK-10). Deshalb können GitHub-Webhooks die übliche Coolify-GitHub-Integration nicht erreichen.

## Entscheidung

1. **Images baut nur GitHub Actions** und legt sie in der GitHub Container Registry (GHCR) ab: bei Merge nach `main` als `:main-<sha>`, bei Tag `vX.Y.Z` **einmal** als `:vX.Y.Z`. Coolify baut selbst nichts.
2. **dev:** Der Build-Workflow tritt danach als ephemerer Tailscale-Knoten (`tag:server:8000` erlaubt, sonst nichts) dem Tailnet bei und löst das Deploy über die Coolify-API mit einem Deploy-Token aus. Anschließend prüft er `/health` auf dev.
3. **int und prod:** Deploy per Image-**Digest**, ausgelöst ausschließlich lokal durch `tools/release` (Teil von `/release`) aus dem Tailnet des Inhabers. prod verlangt eine Bestätigung im Dialog.
4. **Rollback:** `tools/release rollback` setzt prod auf den Digest des vorherigen Release-Tags.

## Alternativen

- **Coolify baut aus Git:** würde für int und prod jeweils neu bauen (kein „build once“) und bräuchte öffentliche Webhooks.
- **Coolify-Webhook über Cloudflare Access + Service-Token öffentlich machen:** öffnet einen Teil der Admin-Oberfläche nach außen, widerspricht AK-10.
- **Pull-basiert (Watchtower o. Ä.):** zusätzlicher Dienst, schlecht nachvollziehbar, keine Freigabe für prod.

## Folgen

- GHCR ist für öffentliche Pakete kostenlos; die Images sind öffentlich (passt zum öffentlichen Repo, keine Secrets im Image).
- Die CI hat einen Netzweg auf genau einen Port des Servers, mit einem Token, der nur deployen darf.
- int und prod lassen sich nur von einem Gerät im Tailnet deployen. Das ist gewollt (Mensch im Loop für prod).
