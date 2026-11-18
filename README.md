# 📻 What Your Music Looks Like — Vintage Hi-Fi Stack & Cassette Archive

> Projet web transformant les morceaux récemment écoutés sur Last.fm en une chaîne stéréo vintage japonaise des années 1970–1980 et son meuble d'archives de cassettes audio.

---

## 🎯 Le Concept : « What your music looks like »

Plutôt qu'une simple grille de pochettes, ce projet matérialise vos écoutes récentes sous la forme d'une **chaîne Hi-Fi skeuomorphique 4 étages** accompagnée de son **rack d'archives de cassettes** :

1. **Analyseur de spectre numérique (Haut)** : 16 colonnes de barres LED incandescentes ambre/orange et mémoires de crêtes (*Peak Hold*) qui oscillent au rythme de la musique.
2. **Platine Cassette TC-90** : Une cassette audio mécanique dont les bobines tournent en direct si un morceau est en cours d'écoute (`now playing`). L'étiquette de la cassette affiche le titre, l'artiste et la miniature de la pochette. Boutons mécaniques tactiles (Play, Pause, Avance, Retour, Stop).
3. **Tuner Radio AM/FM ST-700** : L'échelle de fréquences radio rétro-éclairée sert de **frise temporelle** : l'aiguille rouge glisse pour indiquer le moment où chaque morceau a été joué.
4. **Amplificateur intégré SA-850 (Bas)** : Double VU-mètre analogique à aiguilles oscillantes, réglages de tonalité, gros potentiomètre de volume et interrupteur général d'alimentation (qui éteint ou allume l'ensemble de la chaîne).
5. **Meuble d'archives de cassettes (À droite / En bas sur mobile)** : Présentation de l'ensemble de vos 25 dernières cassettes avec indicateur `LIVE` pour le morceau en cours de lecture. Cliquer sur n'importe quelle cassette la charge instantanément dans la platine TC-90 !

---

## ⚡ Démarrage rapide avec Docker (Recommandé)

Tout le projet (Frontend React + Backend Express + Cache) démarre en une seule commande grâce à Docker Compose.

### 1. Cloner le dépôt
```bash
git clone https://github.com/TheoInTheMelo/what-your-music-looks-like.git
cd what-your-music-looks-like
```

### 2. Configurer les variables d'environnement
Copiez le modèle `.env.example` vers `.env` :
```bash
cp .env.example .env
```
Éditez le fichier `.env` pour y renseigner votre clé API Last.fm :
```env
LASTFM_API_KEY=votre_cle_api_lastfm
LASTFM_USERNAME=TheoInTheMelo
PORT=3000
CACHE_TTL_SECONDS=60
```
*(Remarque : Le fichier `.env` est exclu du dépôt Git via `.gitignore` pour garantir qu'aucune clé secrète ne fuite).*

### 3. Lancer l'application
```bash
docker compose up
```

Ouvrez votre navigateur sur **[http://localhost:3000](http://localhost:3000)**.

Pour arrêter le conteneur :
```bash
docker compose down
```

---

## 💻 Démarrage en local (sans Docker)

Si vous préférez exécuter le projet avec Node.js :

```bash
# 1. Installer les dépendances
npm install
npm install --prefix client

# 2. Compiler le frontend
npm run build

# 3. Démarrer le serveur
npm start
```
Puis accédez à `http://localhost:3000`.

Pour le mode développement avec rechargement à chaud (Hot Reload) :
```bash
# Terminal 1 (Serveur API)
npm run dev:server

# Terminal 2 (Client Vite React)
npm run dev:client
```

---

## 🛡️ Respect strict du cahier des charges

| Exigence | Comment c'est implémenté |
| :--- | :--- |
| **Le navigateur ne contacte jamais Last.fm** | Le frontend appelle uniquement `/api/recent-tracks`. Aucun appel externe vers `ws.audioscrobbler.com` dans l'onglet Réseau du navigateur. |
| **Clé API sécurisée** | La clé API reste strictement côté serveur dans `process.env.LASTFM_API_KEY`. Elle n'est jamais exposée au client ni présente dans les commits Git. |
| **Cache serveur (TTL 60s)** | Le serveur Express garde en mémoire (RAM) la réponse Last.fm pendant 60 secondes. Un rafraîchissement répété de la page renvoie le cache avec l'en-tête `X-Cache: HIT` sans requêter Last.fm. |
| **Résilience (Last.fm inaccessible)** | En cas de panne Last.fm ou de coupure réseau, le serveur bascule automatiquement sur les dernières données valides en cache ou renvoie un code 503 explicite. L'interface affiche un bandeau rétro d'avertissement et un bouton de reconnexion, jamais d'écran blanc. |
| **Responsive Mobile & Desktop** | Mise en page adaptative : disposition 2 colonnes sur grand écran (Chaîne Hi-Fi à gauche, Étagère à cassettes à droite), et empilement vertical optimisé sur smartphone. |
| **Démarrage 1-clic** | `docker compose up` démarre l'application complète sur une copie neuve du dépôt. |

---

## 🎙️ Fiche Mémo pour la Démo de 3 minutes

1. **Introduction (30s)** :
   - Présentez l'idée : « Au lieu d'une simple liste, j'ai voulu représenter mes écoutes sous la forme d'une chaîne Hi-Fi 70s-80s et son étagère de cassettes audio. »
   - Montrez la cassette TC-90 : les bobines qui tournent si une musique est en cours (`now playing`), l'étiquette personnalisée avec la vraie pochette d'album.
2. **Interactions & Timeline (1 min)** :
   - Cliquez sur différentes cassettes dans le meuble d'archive à droite : la cassette est "insérée" dans le lecteur, le tuner radio déplace son aiguille sur l'échelle de fréquences (qui sert de timeline), le spectre LED s'anime et les doubles VU-mètres oscillent.
   - Montrez les commandes de transport (Rewind, Fast-Forward, Play, Pause, interrupteur Power).
3. **Preuve technique & Questions possibles (1 min 30)** :
   - **Question 1 : Comment prouver que la clé ne fuite pas et que le navigateur ne contacte pas Last.fm ?**
     - Ouvrez l'inspecteur du navigateur (F12) > Onglet **Réseau (Network)** > Filtrez sur `Fetch/XHR`.
     - Montrez que la seule requête est `GET /api/recent-tracks` vers `localhost:3000`. Aucune requête ne part vers `last.fm`.
   - **Question 2 : Comment fonctionne le cache ?**
     - Cliquez deux fois d'affilée sur le bouton **SYNC** ou faites F5 : montrez l'en-tête `X-Cache: HIT` et le badge vert `Cache: HIT (xx s)` dans l'en-tête. Le serveur n'a pas rappelé Last.fm.
   - **Question 3 : Que se passe-t-il si Last.fm est en panne ?**
     - Le serveur intercepte l'erreur dans un bloc `try/catch` : il sert les dernières données en cache avec un message d'alerte, ou affiche un bandeau de signal interrompu clair sans faire crasher l'application.
