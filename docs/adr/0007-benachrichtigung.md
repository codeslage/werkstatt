# ADR 0007 – Benachrichtigung: Better Stack (Uptime + Heartbeat)

> Status: **Vertagt** bis Phase S (ADR 0009) · Stand: 2026-11-05
> Bezug: `specs/04-fundament/spec.md` (AK-19, offene Frage 4), Constitution Artikel XVI

## Kontext

Ein fehlgeschlagenes Backup und ein Ausfall von `status.codeslage.de` sollen innerhalb von 30 Minuten per Mail beim Inhaber ankommen. Die Überwachung muss außerhalb des Servers laufen, sonst fällt sie mit ihm aus. Laut Spec reicht ein kostenloser externer Dienst.

## Optionen

| | Better Stack Free | UptimeRobot Free + Healthchecks.io | Uptime Kuma (selbst gehostet) |
|---|---|---|---|
| HTTP-Monitor | ✅ 10 Monitore, alle 3 min | ✅ UptimeRobot, alle 5 min | ✅ |
| Heartbeat (Dead-Man-Switch) | ✅ 10 Heartbeats | ✅ Healthchecks.io | ✅ |
| Mail | ✅ | ✅ | braucht eigenen SMTP |
| Anzahl Dienste | 1 | 2 | 0, läuft aber auf dem überwachten Server |
| Firmensitz | EU (Tschechien) | USA/EU | – |

## Entscheidung

**Better Stack (Free)**:
- HTTP-Monitor für `status.codeslage.de`, Intervall 3 min
- Heartbeat „Backup“: Der tägliche Workflow `backup-check.yml` pingt bei Erfolg und meldet `/fail`, wenn das neueste Backup älter als 26 h ist. Bleibt der Ping aus (Workflow kaputt), schlägt der Heartbeat nach 24 h + 30 min Karenz an.

Ein Dienst für beide Fälle, mit EU-Firmensitz, und keine Abhängigkeit vom überwachten Server.

## Folgen

- Die Heartbeat-URL ist ein Secret (GitHub Secret, `docs/secrets.md`).
- GitHub-Cron kann sich verzögern. Der Backup-Check läuft deshalb 1 h nach dem Backup, und die Karenz von 30 min zählt ab der Erwartung, nicht ab dem Backup.
- Limits des Free-Plans aus Sekundärquellen. Vor der Einrichtung auf betterstack.com/pricing prüfen, AVV abschließen, in `docs/dsgvo.md` erfassen.

## Quellen

- [Better Stack vs Healthchecks.io (2026, Herstellerquelle)](https://betterstack.com/community/comparisons/better-stack-vs-healthchecks-io/)
- [cubeapm: Better Stack pricing review](https://cubeapm.com/blog/betterstack-pricing-review/)
