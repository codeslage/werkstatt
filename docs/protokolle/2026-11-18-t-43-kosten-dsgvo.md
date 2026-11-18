# Protokoll T-43: Kosten 0 € und Dienstleister

> Datum: 2026-11-18 · Task: T-43 · AK: AK-15, AK-28 · PR: PR-18b

1. GitHub: Organisation `codeslage` im Tarif `free` (per API). Actions für öffentliche Repos kostenlos. Abweichung vom Plan (Test „Abrechnung zeigt 0 €“): Die Abrechnungsseite braucht den Scope `admin:org`, den der gh-Login bewusst nicht hat; nutzungsabhängige Kosten können nicht entstehen, weil nur das öffentliche Repo Workflows hat.
2. Cloudflare: Zone `codeslage.de` im Plan „Free Website“, 0 USD (per API). R2-Nutzung im laufenden Monat laut Abrechnungsseite (Screenshot des Inhabers): 30 Class-A- und 36 Class-B-Zugriffe, 0 GB gespeichert, alles im Gratis-Kontingent, **0,00 $**.
3. Docker Desktop: kostenloser Tarif; im Einsatz erst ab Schritt 3 auf dem Mac.
4. **AK-15 erfüllt:** zusätzliche laufende Kosten der Phase 0 €. Das Claude-Abo zählt wie Domain und Workspace zum schon bestehenden Budget (`specs/01-vision.md`). Domain, Google Workspace und das Claude-Abo bestanden schon vorher; sie stehen in `docs/kosten.md` unter „Bestehende Kosten“: Workspace Business Starter 4,05 €/Monat (Rabatt bis 2027-02-17, danach 8,10 €; Screenshot der Abrechnung, Zahlungskonto-ID nicht übernommen), Domain ca. 5 €/Jahr (Angabe des Inhabers).
5. Dienstleister (AK-28): `docs/dsgvo.md` um DMARC-Berichte (Cloudflare), Kalender (Google, Connector bei Anthropic) und die Claude GitHub App ergänzt. AVV/DPA je Dienst: GitHub und Cloudflare über die Bedingungen, Google über den Workspace-Vertrag (in der Admin-Konsole kein eigener Schalter, laut Inhaber), Anthropic im Tarif Pro und Docker Personal **ohne** DPA.
6. Einschätzung (keine Rechtsberatung): In Phase 1 werden nur Daten des Inhabers verarbeitet, ein AVV ist daher nicht zwingend. Als Regel in `docs/dsgvo.md`: vor der ersten Verarbeitung von Daten Dritter AVVs abschließen, bei Anthropic dann ein kommerzieller Tarif. **AK-28 erfüllt.**
