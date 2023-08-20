# Heartbeat Country

## Prérequis

- [Node.js] version `^20.5.1`
- [MongoDB] version `^7.0.0`

### Installation de [Node.js] sur Windows

Il est préférable d'utiliser [Scoop] pour installer et maintenir à jour
[Node.js]. Pour débuter, ouvrir une invite de commande PowerShell et exécuter
les commandes suivantes:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

scoop bucket add main
scoop install main/nodejs
```

Pour mettre à jour [Node.js]:

```powershell
scoop update
```

### Installation de [Node.js] sur Fedora ou RHEL

```bash
sudo dnf module install nodejs
```

### Installation de [Node.js] sur Ubuntu ou Debian

https://github.com/nodesource/distributions#debinstall

### Installation via Kubernetes (podman, Docker)

*À venir*

## Installation

Lorsque les prérequis sont installés, les paquets NPM nécessaires à l'usage de
Astro peuvent être installés en une seule commande:

```bash
npm install
```

## Commandes

À partir de la racine du projet, les commandes suivantes peuvent être exécutées:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installe tous les paquets NPM requis             |
| `npm run dev`             | Ouvre un serveur local à http://localhost:3000   |
| `npm run build`           | Déploie en production vers `./dist/`             |
| `npm run preview`         | Révise le déploiement localement                 |
| `npm run astro ...`       | Exécute des commandes astro                      |
| `npm run astro -- --help` | Obtient l'aide de astro                          |

[Node.js]: https://nodejs.org/fr
[MongoDB]: https://www.mongodb.com/try/download/community
[Scoop]: https://scoop.sh/
