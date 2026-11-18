# Protokoll T-40: monatlicher Historien-Scan

> Datum: 2026-11-18 · Task: T-40 · AK: AK-24 · PR: PR-17a

1. `infra/tests/history-scan.test.ts` zuerst geschrieben (rot: `history-scan.yml` fehlt), dann `.github/workflows/history-scan.yml`: am 1. jedes Monats und manuell; gitleaks gepinnt wie in `ci.yml`, `cli.ts git . --require-blocklist` über alle Branches, Sperrliste aus dem Secret `PUBLIC_BLOCKLIST`. Test 3/3 grün.
2. Derselbe Scan lokal mit `.sperrliste`: **29 Commits, 0 Funde.**
3. Runbook `docs/runbooks/historien-scan.md`: was läuft, Vorgehen bei Funden, wenn der Lauf ausbleibt.
4. Ein manueller Start ist erst möglich, wenn der Workflow auf `main` liegt (GitHub bietet `workflow_dispatch` nur dort an); deshalb nach dem Merge von PR-17a.
5. Manueller Start auf `main` (Run 44297365331): **grün, 30 Commits, 0 Funde**, keine Treffer im öffentlichen Log. Nachgetragen mit PR-17b.
