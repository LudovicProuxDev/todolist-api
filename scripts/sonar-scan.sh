#!/usr/bin/env bash
# Analyse the backend and/or the frontend with the local SonarQube and wait for the
# Quality Gate: exits with an error when a rating is B or worse.
# Usage: scripts/sonar-scan.sh [backend] [frontend]   (both by default)
set -euo pipefail
cd "$(dirname "$0")/.."

set -a
source .env.sonar.local
set +a

SCANNER=sonarsource/sonar-scanner-cli:12.2.0.4256_8.1.0
apps=("$@")
[ ${#apps[@]} -eq 0 ] && apps=(backend frontend)

status=0
for app in "${apps[@]}"; do
  echo "=== Analysing $app"
  docker run --rm --network host -e SONAR_HOST_URL -e SONAR_TOKEN \
    -v "$PWD/$app:/usr/src" "$SCANNER" \
    -Dsonar.qualitygate.wait=true \
    -Dsonar.working.directory=/tmp/scannerwork \
    -Dsonar.nodejs.executable=/usr/bin/node \
    || status=1
  echo "Report: $SONAR_HOST_URL/dashboard?id=todolist-$app"
done

exit $status
