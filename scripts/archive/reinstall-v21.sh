#!/bin/bash
# Reinstall all vendor blocks with --angular-version 21
# Reads block names from /tmp/reinstall-blocks.txt grouped by category

set -e

BLOCKS_FILE="/tmp/reinstall-blocks.txt"
LOG_FILE="/tmp/reinstall-v21.log"
> "$LOG_FILE"

# Get unique categories
CATEGORIES=$(cut -d/ -f1 "$BLOCKS_FILE" | sort -u)

TOTAL=0
OK=0
FAIL=0

for cat in $CATEGORIES; do
  # Get all blocks in this category
  BLOCKS=$(grep "^${cat}/" "$BLOCKS_FILE" | tr '\n' ' ')
  COUNT=$(grep -c "^${cat}/" "$BLOCKS_FILE")

  echo "[$cat] installing $COUNT blocks..."

  if npx @ngm-dev/cli add $BLOCKS --angular-version 21 --skip-asking-for-dependencies --skip-installing-dependencies -y >> "$LOG_FILE" 2>&1; then
    echo "[$cat] ✓ $COUNT OK"
    OK=$((OK + COUNT))
  else
    echo "[$cat] ✗ FAILED (will retry individually)"
    # Retry individually
    for block in $BLOCKS; do
      if npx @ngm-dev/cli add "$block" --angular-version 21 --skip-asking-for-dependencies --skip-installing-dependencies -y >> "$LOG_FILE" 2>&1; then
        echo "  [$block] ✓"
        OK=$((OK + 1))
      else
        echo "  [$block] ✗ FAILED"
        FAIL=$((FAIL + 1))
      fi
    done
  fi

  TOTAL=$((TOTAL + COUNT))

  # Brief pause between categories
  sleep 2
done

echo ""
echo "=== DONE ==="
echo "Total: $TOTAL  OK: $OK  FAIL: $FAIL"
