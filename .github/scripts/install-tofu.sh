#!/bin/sh
# OpenTofu und tflint gepinnt und mit Prüfsumme aus den offiziellen Releases. Gleiche Version wie lokal,
# damit fmt-Ergebnisse nicht abweichen. Gemeinsam für cwk-code.yml, ci.yml und drift.yml.
# Aufruf: install-tofu.sh [--with-tflint]
set -eu
TOFU_VERSION=1.13.1
TOFU_SHA256=378ada19d4bc70c43732004e8159be771b23b9a5afdf059e5f8a2b3fa2c70a69
TFLINT_VERSION=0.66.0
TFLINT_SHA256=22be11cadc25cd02401e94c0ccc91aa63467debb8485c2a755d98f4c0a9d1e2e

mkdir -p "$RUNNER_TEMP/bin"
tofu="tofu_${TOFU_VERSION}_linux_amd64.tar.gz"
curl -sSfL -o "$RUNNER_TEMP/$tofu" "https://github.com/opentofu/opentofu/releases/download/v${TOFU_VERSION}/$tofu"
echo "${TOFU_SHA256}  $RUNNER_TEMP/$tofu" | sha256sum -c -
tar -xzf "$RUNNER_TEMP/$tofu" -C "$RUNNER_TEMP/bin" tofu

if [ "${1:-}" = "--with-tflint" ]; then
  curl -sSfL -o "$RUNNER_TEMP/tflint.zip" \
    "https://github.com/terraform-linters/tflint/releases/download/v${TFLINT_VERSION}/tflint_linux_amd64.zip"
  echo "${TFLINT_SHA256}  $RUNNER_TEMP/tflint.zip" | sha256sum -c -
  unzip -q "$RUNNER_TEMP/tflint.zip" -d "$RUNNER_TEMP/bin"
fi
echo "$RUNNER_TEMP/bin" >> "$GITHUB_PATH"
