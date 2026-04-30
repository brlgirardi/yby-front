#!/bin/bash
# deploy-history.sh
# Faz deploy de cada versão antiga no Vercel e atualiza changelog.json com as URLs.
# Uso: bash scripts/deploy-history.sh
# Pré-requisito: vercel CLI instalado e autenticado (vercel whoami)

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHANGELOG="$ROOT/src/data/changelog.json"
CURRENT_BRANCH=$(git -C "$ROOT" rev-parse --abbrev-ref HEAD)
VERCEL_DIR="$ROOT/.vercel"

echo "🚀 Yby Front — Deploy histórico de versões"
echo "Branch atual: $CURRENT_BRANCH"
echo ""

# Versões com commit hash definido (exclui HEAD e commit atual do main)
CURRENT_COMMIT=$(git -C "$ROOT" rev-parse --short HEAD)
VERSIONS=$(node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$CHANGELOG'));
data
  .filter(v => v.commit && v.commit !== 'HEAD' && v.commit !== '$CURRENT_COMMIT')
  .forEach(v => console.log(v.version + ' ' + v.commit));
")

if [ -z "$VERSIONS" ]; then
  echo "✅ Nenhuma versão histórica para deployar."
  exit 0
fi

echo "Versões para deploy:"
echo "$VERSIONS"
echo ""

TMPBASE=$(mktemp -d)
trap "rm -rf '$TMPBASE'" EXIT

# Para cada versão, extrai via git archive (sem checkout) + deploy
while IFS=' ' read -r version commit; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📌 v$version → commit $commit"

  TMPDIR="$TMPBASE/$version"
  mkdir -p "$TMPDIR"

  # Extrai snapshot do commit sem alterar working tree
  git -C "$ROOT" archive "$commit" | tar -x -C "$TMPDIR"

  # Copia .vercel/project.json para o tmp (necessário para vincular ao projeto Vercel)
  if [ -d "$VERCEL_DIR" ]; then
    cp -r "$VERCEL_DIR" "$TMPDIR/.vercel"
  fi

  # Deploy no Vercel a partir do diretório temporário
  echo "   Enviando para Vercel..."
  DEPLOY_OUTPUT=$(cd "$TMPDIR" && vercel deploy --yes 2>&1)

  # Extrai URL: tenta JSON primeiro, depois linha "Preview: https://..."
  DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | node -e "
let data = '';
process.stdin.on('data', d => data += d);
process.stdin.on('end', () => {
  const jsonMatch = data.match(/\"url\":\s*\"(https:\/\/[^\"]+)\"/);
  if (jsonMatch) { console.log(jsonMatch[1]); return; }
  const lines = data.split('\n');
  for (const l of lines) {
    const m = l.match(/Preview:\s*(https:\/\/\S+)/);
    if (m) { console.log(m[1]); return; }
  }
});
" 2>/dev/null)

  if [ -z "$DEPLOY_URL" ]; then
    echo "   ⚠️  Deploy falhou ou URL não capturada para v$version. Pulando."
    echo "   Últimas linhas: $(echo "$DEPLOY_OUTPUT" | tail -3)"
  else
    echo "   ✅ URL: $DEPLOY_URL"

    # Atualiza changelog.json com a URL (main não foi tocado)
    node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$CHANGELOG'));
const entry = data.find(v => v.version === '$version');
if (entry) { entry.previewUrl = '$DEPLOY_URL'; }
fs.writeFileSync('$CHANGELOG', JSON.stringify(data, null, 2) + '\n');
console.log('   📝 changelog.json atualizado');
"
  fi

done <<< "$VERSIONS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Commit das URLs atualizadas
echo "💾 Commitando URLs no changelog.json..."
git -C "$ROOT" add "$CHANGELOG"
git -C "$ROOT" commit -m "chore(changelog): preview URLs das versões históricas via Vercel" --no-verify 2>/dev/null || echo "   (nada novo para commitar)"
git -C "$ROOT" push origin "$CURRENT_BRANCH"

echo ""
echo "✅ Concluído! Abra o modal de versões no app para ver os links."
