# Déploiement sur GitHub Pages

## Configuration automatique

Le projet est configuré pour se déployer automatiquement sur GitHub Pages à chaque push sur la branche `main`.

## Configuration manuelle

Si vous devez déployer manuellement :

1. **Build pour production** :
   ```bash
   cp next.config.production.js next.config.js
   NODE_ENV=production npm run build
   ```

2. **Les vidéos** :
   Les chemins des vidéos sont automatiquement ajustés pour GitHub Pages grâce à la fonction `getAssetPath()` dans `utils/assetPath.ts`.

## URLs des assets

En production sur GitHub Pages :
- Les vidéos seront accessibles à : `https://[username].github.io/brandon-funnel/brandon-message.mp4`
- Les autres assets suivront le même pattern avec le préfixe `/brandon-funnel/`

## Vérification

Après le déploiement, vérifiez que :
1. Le site est accessible à `https://[username].github.io/brandon-funnel/`
2. Les vidéos se chargent correctement
3. Tous les styles CSS sont appliqués (fond noir, texte doré, etc.)

## Troubleshooting

Si les vidéos ne se chargent pas :
1. Vérifiez que les fichiers vidéo sont bien dans le dossier `public/`
2. Vérifiez que le repository GitHub Pages est configuré correctement
3. Attendez quelques minutes après le déploiement pour que GitHub Pages propage les changements