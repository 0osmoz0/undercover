# Undercover

Jeu de société local (pass-the-phone) : un seul téléphone, on se le passe entre amis.

## Lancer

```bash
npm install
npx expo start
```

Scanne le QR code avec **Expo Go**.

## Flow

1. Accueil → Nouvelle partie  
2. Setup (noms, nombre d’undercover)  
3. Distribution secrète des mots  
4. Discussion + timer  
5. Vote secret  
6. Révélation / manche suivante / fin  

## Scripts

| Commande | Rôle |
|----------|------|
| `npm start` | Expo |
| `npm test` | Tests logique |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |

## Stack

Expo SDK 56 · expo-router · TypeScript · Jest
