# Runbook: Historien-Scan

> Stand: 2026-11-18 · Bezug: `docs/prozess/governance.md` (Öffentlich vs. intern), AK-24, Constitution V und VI

## 1. Was läuft

`.github/workflows/history-scan.yml` scannt am 1. jedes Monats (04:23 UTC) und auf Knopfdruck die **gesamte Historie aller Branches** mit gitleaks, den eigenen Regeln aus `.gitleaks.toml` und der Sperrliste (GitHub Secret `PUBLIC_BLOCKLIST`).

Der Scan in der CI (`cwk-rules.yml`, Job „Secret- und Öffentlich-Scan“) prüft bei jedem PR dasselbe. Der monatliche Lauf ist dafür da, dass neue gitleaks-Regeln oder neue Sperrbegriffe auch dann auf alte Commits angewendet werden, wenn gerade kein PR läuft.

Manuell starten: Actions → „Historien-Scan“ → Run workflow. Mit Haken bei `simulate_failure` bricht der Lauf absichtlich ab; so lässt sich die Fehler-Mail testen (AK-27). Lokal: `node tools/public-scan/src/cli.ts git . --require-blocklist` (Sperrliste aus `.sperrliste`).

## 2. Wenn er rot ist

GitHub schickt bei einem fehlgeschlagenen geplanten Lauf eine Mail (AK-27, nachgewiesen am 2026-11-18, Protokoll T-41). Im Log stehen Regel, Datei und Commit; der Treffer selbst ist geschwärzt.

1. **Fehlalarm?** Lokal mit demselben Befehl nachvollziehen. Ist der Treffer harmlos (z. B. eine Rollenadresse), die Ausnahme in `.gitleaks.toml` per PR ergänzen, mit Begründung.
2. **Secret oder Token:** sofort widerrufen bzw. rollen (`docs/runbooks/token-erneuerung.md`), dann `docs/secrets.md` anpassen. Was öffentlich war, gilt als bekannt.
3. **Interne Angabe** (Konto, Registrar, IP, Kontaktdaten): Angabe aus dem aktuellen Stand entfernen und nach `codeslage/internal` verschieben (PR). Ob die Historie umgeschrieben wird, entscheidet der Inhaber ausdrücklich für genau diesen Fall (Constitution V); vorher zeigen, welche Commits und Branches betroffen sind.
4. Im Protokoll (`docs/protokolle/`) festhalten, was gefunden und was getan wurde.

## 3. Wenn er ohne Scan abbricht oder ausbleibt

- Rot mit `Sperrliste fehlt … Abbruch` (Exit 2): Secret `PUBLIC_BLOCKLIST` fehlt oder ist leer, aus `.sperrliste` neu setzen.
- GitHub pausiert geplante Workflows in Repos ohne Aktivität seit 60 Tagen; dann im Actions-Tab wieder aktivieren.
