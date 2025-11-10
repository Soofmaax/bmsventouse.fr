#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Add SmarterLogicWeb copyright headers to source files
# - Detects file type by extension
# - Skips files that already contain a SmarterLogicWeb header
# - Skips common vendor/build directories
# -----------------------------------------------------------------------------

YEAR="2025"
AUTHOR="SmarterLogicWeb"
WEBSITE="https://smarterlogicweb.com"
LICENSE="MIT" # Adjust if needed

ROOT_DIR="${1:-.}"

is_skipped_dir() {
  case "$1" in
    */.git*|*/node_modules*|*/dist*|*/build*|*/.cache*|*/.github*|*/images*|*/assets*|*/vendor*)
      return 0 ;;
    *) return 1 ;;
  esac
}

has_header() {
  grep -q "SmarterLogicWeb" "$1" 2>/dev/null || return 1
}

add_header_js() {
  local file="$1"
  local tmp
  tmp="$(mktemp)"
  cat >"$tmp" <<'EOF'
/**
 * @file [Short description]
 * @author SmarterLogicWeb
 * @copyright YEAR SmarterLogicWeb. All rights reserved.
 * @license LICENSE
 * @see {@link WEBSITE}
 */
EOF
  sed -i "s/YEAR/${YEAR}/g; s/WEBSITE#/${WEBSITE//\//\\/}/g; s/WEBSITE/${WEBSITE//\//\\/}/g; s/LICENSE/${LICENSE}/g" "$tmp"
  cat "$tmp" "$file" > "${file}.with-header"
  mv "${file}.with-header" "$file"
  rm -f "$tmp"
}

add_header_css() {
  local file="$1"
  local tmp
  tmp="$(mktemp)"
  cat >"$tmp" <<'EOF'
/**
 * [Short description]
 * 
 * @author SmarterLogicWeb
 * @copyright YEAR SmarterLogicWeb. All rights reserved.
 * @see WEBSITE
 */
EOF
  sed -i "s/YEAR/${YEAR}/g; s/WEBSITE/${WEBSITE//\//\\/}/g" "$tmp"
  cat "$tmp" "$file" > "${file}.with-header"
  mv "${file}.with-header" "$file"
  rm -f "$tmp"
}

add_header_py() {
  local file="$1"
  local tmp
  tmp="$(mktemp)"
  cat >"$tmp" <<'EOF'
"""
[Short description]

Author: SmarterLogicWeb
Copyright: YEAR SmarterLogicWeb. All rights reserved.
License: LICENSE
Website: WEBSITE
"""
EOF
  sed -i "s/YEAR/${YEAR}/g; s/WEBSITE/${WEBSITE//\//\\/}/g; s/LICENSE/${LICENSE}/g" "$tmp"
  cat "$tmp" "$file" > "${file}.with-header"
  mv "${file}.with-header" "$file"
  rm -f "$tmp"
}

process_file() {
  local file="$1"
  if has_header "$file"; then
    echo "skip (has header): $file"
    return
  fi

  case "$file" in
    *.js|*.mjs|*.cjs|*.ts)
      add_header_js "$file"
      ;;
    *.css|*.scss)
      add_header_css "$file"
      ;;
    *.py)
      add_header_py "$file"
      ;;
    *)
      echo "skip (unsupported): $file"
      ;;
  esac
}

export -f is_skipped_dir has_header add_header_js add_header_css add_header_py process_file
export YEAR AUTHOR WEBSITE LICENSE

# Walk the tree and process supported files
find "$ROOT_DIR" -type f \
  \( -name "*.js" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.ts" -o -name "*.css" -o -name "*.scss" -o -name "*.py" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  ! -path "*/.cache/*" \
  ! -path "*/images/*" \
  ! -path "*/assets/*" \
  ! -path "*/vendor/*" \
  -print0 | while IFS= read -r -d '' f; do
    process_file "$f"
  done

echo "✅ Headers applied where missing."