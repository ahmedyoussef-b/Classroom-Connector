#!/bin/bash

# Script pour automatiser la mise à jour du dépôt GitHub

# Message de commit par défaut
COMMIT_MESSAGE="Mise à jour automatique des fichiers"

# Si un message est passé en argument, on l'utilise
if [ -n "$1" ]; then
  COMMIT_MESSAGE="$1"
fi

echo "🚀 Démarrage de la mise à jour vers GitHub..."

# 1. Ajoute tous les fichiers modifiés
echo "📦 Ajout des fichiers..."
git add .

# 2. Fait un commit avec le message
echo "📝 Création du commit avec le message : '$COMMIT_MESSAGE'"
git commit -m "$COMMIT_MESSAGE"

# 3. Pousse les changements vers la branche master
echo "📤 Pousse des changements vers la branche master..."
git push origin master

echo "✅ Mise à jour terminée avec succès !"
