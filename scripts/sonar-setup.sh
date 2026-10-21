#!/usr/bin/env bash
# Configure the local SonarQube (compose.yaml): admin password, projects,
# "Rating A" Quality Gate and analysis token.
# Credentials are stored in .env.sonar.local (not versioned). Safe to run again.
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=.env.sonar.local
GATE="Rating A"
PROJECTS=("todolist-backend:TodoList Backend" "todolist-frontend:TodoList Frontend")

[ -f "$ENV_FILE" ] || cp .env.sonar.example "$ENV_FILE"
source "$ENV_FILE"

set_var() {
  sed -i "s|^$1=.*|$1=$2|" "$ENV_FILE"
}

if [ -z "$SONAR_ADMIN_PASSWORD" ]; then
  SONAR_ADMIN_PASSWORD="$(openssl rand -hex 16)Aa1!"
  set_var SONAR_ADMIN_PASSWORD "$SONAR_ADMIN_PASSWORD"
fi

# Replace the default admin password on a fresh instance
if curl -sf -u admin:admin "$SONAR_HOST_URL/api/authentication/validate" | grep -q '"valid":true'; then
  curl -sf -u admin:admin -X POST "$SONAR_HOST_URL/api/users/change_password" \
    -d login=admin -d previousPassword=admin --data-urlencode "password=$SONAR_ADMIN_PASSWORD"
  echo "Admin password changed"
fi

api() {
  curl -sf -u "$SONAR_ADMIN_LOGIN:$SONAR_ADMIN_PASSWORD" "$SONAR_HOST_URL/api/$1" "${@:2}"
}

for project in "${PROJECTS[@]}"; do
  key="${project%%:*}"
  if api projects/search -G -d "projects=$key" | grep -q '"total":0'; then
    api projects/create -X POST -d "project=$key" --data-urlencode "name=${project#*:}" >/dev/null
    echo "Project $key created"
  fi
done

if ! api qualitygates/show -G --data-urlencode "name=$GATE" >/dev/null 2>&1; then
  api qualitygates/create -X POST --data-urlencode "name=$GATE" >/dev/null
  # The gate fails as soon as a rating is worse than A (B, C, D or E)
  for metric in reliability_rating security_rating sqale_rating security_review_rating; do
    api qualitygates/create_condition -X POST --data-urlencode "gateName=$GATE" \
      -d "metric=$metric" -d op=GT -d error=1 >/dev/null
  done
  echo "Quality Gate \"$GATE\" created"
fi

# Keep only the rating conditions (SonarQube adds the "Sonar way" ones on creation)
for id in $(api qualitygates/show -G --data-urlencode "name=$GATE" | python3 -c '
import json, sys
ratings = {"reliability_rating", "security_rating", "sqale_rating", "security_review_rating"}
print(" ".join(c["id"] for c in json.load(sys.stdin)["conditions"] if c["metric"] not in ratings))'); do
  api qualitygates/delete_condition -X POST -d "id=$id"
done
api qualitygates/set_as_default -X POST --data-urlencode "name=$GATE"

if [ -z "$SONAR_TOKEN" ]; then
  api user_tokens/revoke -X POST -d name=local-scan || true
  SONAR_TOKEN=$(api user_tokens/generate -X POST -d name=local-scan -d type=USER_TOKEN \
    | python3 -c 'import json, sys; print(json.load(sys.stdin)["token"])')
  set_var SONAR_TOKEN "$SONAR_TOKEN"
  echo "Analysis token generated"
fi

echo "SonarQube ready on $SONAR_HOST_URL (credentials in $ENV_FILE)"
