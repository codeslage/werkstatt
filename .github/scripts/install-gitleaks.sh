#!/bin/sh
# gitleaks gepinnt und mit Prüfsumme aus den offiziellen Releases (ADR 0008: kein gitleaks-action).
# Gemeinsam für cwk-rules.yml, cwk-code.yml und history-scan.yml, damit überall dieselbe Version läuft.
set -eu
GITLEAKS_VERSION=8.30.1
GITLEAKS_SHA256=551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb

archive="gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"
curl -sSfL -o "$RUNNER_TEMP/$archive" \
  "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/$archive"
echo "${GITLEAKS_SHA256}  $RUNNER_TEMP/$archive" | sha256sum -c -
mkdir -p "$RUNNER_TEMP/bin"
tar -xzf "$RUNNER_TEMP/$archive" -C "$RUNNER_TEMP/bin" gitleaks
echo "$RUNNER_TEMP/bin" >> "$GITHUB_PATH"
