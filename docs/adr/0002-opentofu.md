# ADR 0002 – OpenTofu, State in R2, `apply` nur lokal

> Status: **Vorgeschlagen** · Stand: 2026-11-05
> Bis Phase S verwaltet OpenTofu nur Cloudflare (Zone, DNS, Zonen-Einstellungen, State-Bucket); Server-Teile kommen mit Phase S (ADR 0009).
> Bezug: `specs/02-architektur.md` (A3, ADR-Vorschlag), `specs/04-fundament/plan.md`

## Kontext

Die Infrastruktur soll vollständig als Code entstehen (Artikel X). Der State enthält sensible Werte, z. B. den privaten Schlüssel des Cloudflare-Origin-Zertifikats.

## Entscheidung

1. **OpenTofu** statt Terraform: MPL-Lizenz und eingebaute **State-Verschlüsselung**. Der HCL-Code bleibt mit Terraform kompatibel.
2. **State** im R2-Bucket `codeslage-tofu-state` (S3-Backend mit Lockfile), verschlüsselt mit dem Key-Provider `pbkdf2`. Die Passphrase liegt in `.env` und als GitHub Secret.
3. **`tofu apply` nur lokal durch den Inhaber**, nach gemeinsam geprüftem `plan`. Die CI führt nur `fmt`, `validate`, `tflint` und `plan -lock=false` mit **Read-only-Tokens** aus (Drift-Check, AK-5).
4. Provider-Versionen sind über `.terraform.lock.hcl` festgeschrieben; Updates per Dependabot.
5. Bootstrap: Der State-Bucket wird einmalig aus `infra/tofu/bootstrap` mit lokalem State angelegt; danach wandert dessen State in denselben Bucket.

### Nachtrag 2026-11-05: Zahlungsmethode für R2

Laut mehreren Anleitungen verlangt Cloudflare eine hinterlegte Zahlungsmethode, bevor der erste R2-Bucket angelegt werden kann, auch wenn die Nutzung im Gratis-Kontingent bleibt (10 GB Speicher, 1 Mio. Schreib- und 10 Mio. Lese-Operationen pro Monat). In Cloudflares eigener Doku habe ich das nicht bestätigt gefunden. Der State ist nur wenige KB groß, daher fallen keine Kosten an. Die Karte hinterlegt der Inhaber selbst (Voraussetzung V8).

Ausweichweg, falls keine Karte hinterlegt werden soll: verschlüsselter State im privaten Repo `codeslage/internal`, ohne Locking (ein Bearbeiter), Drift-Check dann nur lokal.

## Alternativen

- **Terraform:** verbreiteter bei Kunden, aber ohne native State-Verschlüsselung und unter BSL. Der Code läuft dort trotzdem.
- **`apply` in der CI:** bequemer, aber die CI bräuchte Schreib-Tokens für Server und DNS. Das widerspricht Least Privilege (Artikel VII) und dem Gate „kein apply ohne geprüften plan“ (Artikel V).

## Folgen

- Kein Secret im Klartext im State-Bucket; R2 verschlüsselt zusätzlich ruhende Daten.
- Je zwei Tokens pro Anbieter (rw lokal, ro in der CI), dokumentiert in `docs/secrets.md`.
- Verlust der Passphrase = State unlesbar. Sie liegt deshalb zusätzlich im Passwort-Manager des Inhabers.
