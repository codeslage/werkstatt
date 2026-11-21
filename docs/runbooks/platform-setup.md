# Runbook: Einrichtung der Projekt-Plattform

> Stand: 2026-11-21 · Bezug: `specs/05-projekt-plattform/plan.md` (Voraussetzungen V1–V6), ADR 0011, 0012, 0013
> Wer: der Inhaber. Claude legt keine Konten, Teams oder Apps an und gibt keine Tokens ein (Plan 05).
> Die Abschnitte kommen mit den Schritten des Plans dazu: Team (Schritt 2), GitHub Apps (Schritt 3), Cloudflare (Schritte 5–7).

## 1. Team `maintainers` (V1)

Das Team ist Code-Owner aller Dateien in jedem öffentlichen Projekt-Repo und in `werkstatt` (`CODEOWNERS`: `* @codeslage/maintainers`). Ein Sync-PR braucht deshalb sein Review. Eine App kann nicht Mitglied sein.

1. GitHub → Organisation `codeslage` → **Teams** → **New team**.
2. Name `maintainers`, Beschreibung „Code-Owner aller Repos (CWK)“.
3. Sichtbarkeit **Visible**. Ein geheimes Team kann kein Code-Owner sein.
4. Einziges Mitglied ist der Inhaber. Weitere Mitglieder kommen erst mit weiteren Personen dazu (Spec 05, Frage 3).
5. Prüfen:

   ```bash
   gh api /orgs/codeslage/teams/maintainers --jq '.privacy + " " + (.members_count|tostring)'
   ```

   Erwartet: `closed 1` (`closed` heißt bei GitHub „sichtbar“).

Schreibrecht je Repo setzt `cwk new`. In `werkstatt` setzt es Claude mit Freigabe des Inhabers (T-08). Ob es wirkt, zeigt der Job „Repo-Einstellungen“: Hat das Team kein Schreibrecht, meldet GitHub für `CODEOWNERS` „Unknown owner“.
