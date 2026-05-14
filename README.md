# XNetfliXX

XNetfliXX est une interface web inspirée d’une plateforme de streaming.

Le projet permet d’afficher dynamiquement des films, séries et documentaires à partir de données récupérées via l’API TMDB.

## Fonctionnalités principales

- Affichage de catégories de contenus
- Récupération de données depuis l’API TMDB
- Génération dynamique des cartes en JavaScript
- Page de détail pour un film ou une série
- Utilisation de `fetch`, `async/await` et `Promise.all`
- Mise en page responsive
- Installation locale avec Apache et domaine local

## Prérequis

Avant de lancer le projet en local, il faut disposer de :

- Apache installé sur la machine ou dans WSL
- Un navigateur web
- Un accès au fichier `hosts` de Windows
- Le projet récupéré depuis GitHub
- Une clé API TMDB configurée dans le projet si nécessaire

## Récupération du projet

Cloner le dépôt GitHub :

```bash
git clone https://github.com/<utilisateur>/xnetflixx.git
```

Entrer dans le dossier du projet :

```bash
cd xnetflixx
```

Dans mon environnement local, le projet était placé dans un dossier de travail Windows accessible depuis WSL, par exemple :

```bash
/mnt/c/Users/fgs/code/bwb/xnetflixx
```

## Installation rapide du serveur Apache

### 1. Ajout des fichiers dans le répertoire Apache

Créer un lien symbolique entre le dossier du projet et le dossier utilisé par Apache :

```bash
sudo ln -s /mnt/c/Users/fgs/code/bwb/xnetflixx /var/www/xnetflixx.bwb.local
```

Cette commande permet à Apache d’accéder au projet sans déplacer les fichiers du dossier de travail.

### 2. Ajout de la configuration du serveur

Créer la configuration Apache à partir du modèle local :

```bash
sudo sed "s|DOMAIN|xnetflixx.bwb.local|g" /mnt/c/Users/fgs/code/templates/apache2.local.conf \
  | sudo tee /etc/apache2/sites-available/xnetflixx.bwb.local.conf > /dev/null
```

Cette configuration permet de déclarer un VirtualHost pour le domaine local `xnetflixx.bwb.local`.

### 3. Activation du site Apache

Activer le site :

```bash
sudo a2ensite xnetflixx.bwb.local.conf
```

Recharger Apache :

```bash
sudo service apache2 reload
```

### 4. Ajout du domaine local dans le fichier hosts

Ouvrir le fichier `hosts` de Windows en administrateur :

```powershell
notepad C:\Windows\System32\drivers\etc\hosts
```

Ajouter les lignes suivantes :

```txt
127.0.0.1    xnetflixx.bwb.local
::1          xnetflixx.bwb.local
```

Ces lignes permettent d’associer le domaine local à la machine.

### 5. Vérification de la configuration Apache

Vérifier que le VirtualHost est bien déclaré :

```bash
apache2ctl -t -D DUMP_VHOSTS
```

Exemple de résultat attendu :

```txt
VirtualHost configuration:
*:80                   is a NameVirtualHost
  default server FGS-PC. (/etc/apache2/sites-enabled/000-default.conf:1)
  port 80 namevhost FGS-PC. (/etc/apache2/sites-enabled/000-default.conf:1)

[...]

  port 80 namevhost xnetflixx.bwb.local (/etc/apache2/sites-enabled/xnetflixx.bwb.local.conf:1)
    alias www.xnetflixx.bwb.local
```

Si la configuration est correcte, Apache doit afficher :

```txt
Syntax OK
```

### 6. Vérification de l’accès au site

Ouvrir le navigateur et accéder à :

```txt
http://xnetflixx.bwb.local
```

Si le site s’affiche correctement, l’installation locale est terminée.

## Problèmes possibles

### Le site ne se charge pas

Vérifier que :

* Apache est démarré
* Le site est activé avec `a2ensite`
* Le fichier `hosts` contient bien le domaine local
* Le lien symbolique pointe vers le bon dossier
* Le nom du domaine est identique dans Apache et dans le fichier `hosts`

### Les données TMDB ne s’affichent pas

Vérifier que :

* La clé API TMDB est présente
* L’URL appelée est correcte
* L’endpoint existe dans la documentation TMDB
* La console du navigateur ne contient pas d’erreur JavaScript
* La réponse HTTP ne renvoie pas d’erreur 401, 404 ou 500

## Lancement terminé

Lorsque l’installation est correcte, le site est accessible en local à l’adresse :

```txt
http://xnetflixx.bwb.local
```

It works!
