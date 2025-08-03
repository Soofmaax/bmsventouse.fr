# Corrections CSS Header BMS Ventouse

## Problèmes identifiés :

- [x] **Duplication de .promo-banner** : Il y a deux définitions contradictoires (ligne 224 avec `top: 0` et ligne 1162 avec `top: var(--header-height)`)
- [x] **Header mal positionné** : Le header est positionné sous la bannière (`top: var(--promo-banner-height)`) au lieu d'être ensemble en haut
- [x] **Transparence du header** : Le header a `background: rgba(255,255,255,0.95)` qui le rend semi-transparent
- [x] **Espacement du contenu** : Le hero-overlay a un padding-top qui crée un espace excessif

## Corrections apportées :

- [x] Supprimé la duplication de .promo-banner (gardé seulement la première définition)
- [x] Modifié le header : `top: 0` et `z-index: 1001` pour qu'il soit tout en haut
- [x] Modifié la bannière : `top: var(--header-height)` et `z-index: 1000` pour qu'elle soit sous le header
- [x] Rendu le header complètement opaque : `background: rgba(255,255,255,1)`
- [x] Vérifié que l'espacement du contenu principal est correct (hero-overlay utilise déjà le bon padding-top)

## Structure finale obtenue :
```
[Header BMS - position: fixed, top: 0, z-index: 1001]
[Bannière orange - position: fixed, top: 70px, z-index: 1000]
[Contenu principal - commence après header+bannière avec padding-top approprié]
```

## Prêt pour les tests !

