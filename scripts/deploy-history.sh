#!/bin/bash
# deploy-history.sh
# Faz deploy de cada versão antiga no Vercel e atualiza changelog.json com as URLs.
# Uso: bash scripts/deploy-history.sh
# Pré-requisito: vercel CLI instalado e autenticado (vercel whoami)

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHANGELOG="$ROOT/src/data/changelog.json"
CURRENT_BRANCH=$(git -C "$ROOT" rev-parse --abbrev-ref HEAD)

echo "🚀 Yby Front — Deploy histórico de versões"
echo "Branch atual: $CURRENT_BRANCH"
echo ""

# Versões com commit hash definido (exclui HEAD e placeholder)
VERSIONS=$(node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$CHANGELOG'));
data
  .filter(v => v.commit && v.commit !== 'HEAD' && !v.previewUrl)
  .forEach(v => console.log(v.version + ' ' + v.commit));
")

if [ -z "$VERSIONS" ]; then
  echo "✅ Todas as versões já têm preview URL. Nada a fazer."
  exit 0
fi

echo "Versões sem preview URL:"
echo "$VERSIONS"
echo ""

# Salva stash se houver mudanças não commitadas
STASHED=0
if ! git -C "$ROOT" diff --quiet || ! git -C "$ROOT" diff --cached --quiet; then
  echo "📦 Salvando mudanças locais em stash..."
  git -C "$ROOT" stash push -m "deploy-history-temp"
  STASHED=1
fi

# Para cada versão, faz checkout + deploy
while IFS=' ' read -r version commit; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📌 v$version → commit $commit"

  # Checkout do commit
  git -C "$ROOT" checkout "$commit" --quiet

  # Deploy no Vercel (sem prompts, sem prod)
  echo "   Enviando para Vercel..."
  DEPLOY_URL=$(cd "$ROOT" && vercel deploy --yes --no-wait 2>/dev/null | tail -1)

  if [ -z "$DEPLOY_URL" ]; then
    echo "   ⚠️  Deploy falhou ou URL não capturada para v$version. Pulando."
  else
    echo "   ✅ URL: $DEPLOY_URL"

    # Atualiza changelog.json com a URL
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

# Volta para branch original
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔙 Voltando para branch $CURRENT_BRANCH..."
git -C "$ROOT" checkout "$CURRENT_BRANCH" --quiet

# Restaura stash se havia mudanças
if [ $STASHED -eq 1 ]; then
  echo "📦 Restaurando mudanças locais..."
  git -C "$ROOT" stash pop
fi

# Commit das URLs atualizadas
echo ""
echo "💾 Commitando URLs no changelog.json..."
git -C "$ROOT" add "$CHANGELOG"
git -C "$ROOT" commit -m "chore(changelog): preview URLs das versões históricas via Vercel" --no-verify 2>/dev/null || echo "   (nada novo para commitar)"
git -C "$ROOT" push origin "$CURRENT_BRANCH"

echo ""
echo "✅ Concluído! Abra o modal de versões no app para ver os links."
