#!/usr/bin/env bash
# Runs the automated checks before reporting a feature as done or cutting a release.
# Usage (from the project root): bash <skill>/scripts/check.sh [tokens.css]
# Paste the summary into the report: a gate passes on real command output, not on "should work".
set -u

TOKENS="${1:-}"
SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
declare -a RESULTS=()
FAILED=0

has_script() { node -e "process.exit(require('./package.json').scripts?.['$1'] ? 0 : 1)" 2>/dev/null; }

run() {
  local name="$1"; shift
  echo "── $name: $*"
  if "$@"; then RESULTS+=("ok    $name"); else RESULTS+=("FAIL  $name"); FAILED=1; fi
}

skip() { RESULTS+=("skip  $1 ($2)"); }

[ -f package.json ] || { echo "Run this from the project root (no package.json here)."; exit 2; }

if [ -f tsconfig.json ]; then run "typecheck" npx tsc --noEmit; else skip "typecheck" "no tsconfig.json"; fi
if has_script lint; then run "lint" npm run lint --silent; else skip "lint" "no lint script"; fi
if has_script test; then run "tests" npm test --silent; else skip "tests" "no test script"; fi
if has_script build; then run "build" npm run build --silent; else skip "build" "no build script"; fi
run "audit (high+)" npm audit --audit-level=high --omit=dev

if [ -n "$TOKENS" ]; then
  run "theme contrast" node "$SKILL_DIR/check-contrast.mjs" "$TOKENS"
else
  skip "theme contrast" "pass the tokens CSS file as the first argument"
fi

# Bundle size: report the largest JS files so budget regressions are visible
for dir in dist build out; do
  if [ -d "$dir" ]; then
    echo "── largest JS files in $dir/"
    find "$dir" -name "*.js" -type f -exec du -k {} + 2>/dev/null | sort -rn | head -5 | awk '{print "   " $1 " KB  " $2}'
    break
  fi
done

echo
echo "Summary"
printf '  %s\n' "${RESULTS[@]}"
exit $FAILED
