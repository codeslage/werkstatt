# Test-App apps/status (Plan 04, T-27): mehrstufig, ohne Root, mit HEALTHCHECK.
# Build-Kontext ist die Repo-Wurzel (Workspace und Lockfile), siehe compose.yaml.
# Basis-Image per Digest des Multi-Arch-Index gepinnt (arm64 lokal, amd64 in der CI), Updates über Dependabot.

FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/status/package.json apps/status/
# Nur Laufzeit-Abhängigkeiten der App, exakt nach Lockfile.
RUN pnpm install --frozen-lockfile --prod --filter @codeslage/status
COPY apps/status/src apps/status/src

FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5
ENV NODE_ENV=production PORT=3000
WORKDIR /app
# Dateien gehören root und sind für den Benutzer `node` nur lesbar.
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/apps/status apps/status
WORKDIR /app/apps/status
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/health" || exit 1
CMD ["node", "src/main.ts"]
