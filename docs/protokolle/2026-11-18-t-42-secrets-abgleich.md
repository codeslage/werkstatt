# Protokoll T-42: Register gegen die tatsächlichen Tokens

> Datum: 2026-11-18 · Task: T-42 · AK: AK-14 · PR: PR-18a

1. GitHub Secrets des Repos per `gh secret list` (Actions und Dependabot): je 7, alle im Register, keine übrigen.
2. Cloudflare Account API Tokens (Screenshot des Inhabers): genau `codeslage-tofu-rw`, `-state-rw`, `-state-ro`, `-ro`, alle aktiv, Rechte laut Übersicht wie im Register. `codeslage-tofu-rw` per `tokens/verify`: aktiv bis 2027-05-12 00:00 (Berlin). Gegenprobe der Rechte: `live` `plan` 0, `bootstrap` 401.
3. Cloudflare User API Tokens: keine. Global API Key vorhanden (nicht löschbar), nirgends verwendet; im Register vermerkt.
4. GitHub: keine Organisations-Secrets; im Konto des Inhabers keine Personal Access Tokens (classic), als OAuth-App nur GitHub CLI. Die Claude GitHub App ist in der Organisation für alle Repos installiert (per API geprüft); der Inhaber lässt das bewusst so.
5. Ergänzt im Register: `GITHUB_TOKEN`, gh-Login (Scope `gist` wird nicht gebraucht), Claude GitHub App, Global API Key, Abschnitt „Abgleich“.
