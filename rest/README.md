OpenData-Schnittstelle
======================

Was ist das hier?
-----------------

Dieser Ordner enthält zwei Dateien:

- `rest.js` - der eigentliche Webserver
- `cache.php` - ein Script, das Anfragen zwischenspeichert


Start
-----

Die OpenData-Schnittstelle kann mit

    ./rest.js

gestartet werden. Für langfristige Ausführungen hat sich bei uns das Forever Tool (https://github.com/nodejitsu/forever) bewährt.


Voraussetzungen
---------------

Es werden diese Programme benötigt:

- Node.js (http://nodejs.org) 
- Express (http://expressjs.com)

Unter Ubuntu lassen sich diese Tools leicht mit

    apt-get install nodejs npm
    npm install express

installieren.


Fragen
------

Bei Fragen bitte eine Mail an support@piraten-mv.de schreiben. Wir helfen gerne!
