OpenData-Schnittstelle
======================

Was ist das hier?
-----------------

An dieser Stelle soll nach und nach die OpenData-Schnittstelle des Landesverbandes Mecklenburg-Vorpommern der Piratenpartei Deutschland veröffentlicht werden. Eine erste Version ist unter http://opendata.piratenpartei-mv.de erreichbar (sehr unvollständig dokumentiert). Ein erstes Frontend, das die Daten nutzt gibt es unter http://dashboard.piratenpartei-mv.de.

Das Ziel ist es, sämtlich Informationen des Landesverband maschinenlesbar anzubieten, sodass sie unabhängig vom konkreten System (LQFB, Redmine, Piratenpad, Wiki, Webseite, ...) angezeigt und aufbereitet werden können.

Aufbau
------

Letztendlich werden die Daten über eine REST-API im JSON-Format ausgegeben. Dazu nutzen wir Node.js (http://nodejs.org) mit dem Express Framework (http://expressjs.com).

- `cache` wird benutzt, um Anfragen 15 Minuten lang zwischenzuspeichern. Der Inhalt des Ordners kann jederzeit gefahrlos gelöscht werden. Ob ein Cache benutzt werden soll, kann in der Datei `rest/rest.nodejs` eingestellt werden. Die Dauer kann in der Datei `rest/cache.php` eingestellt werden.
- `modules` enthält die Scripte, die vom Webserver mit entsprechenden Parametern ausgeführt werden. Sie stellen die Daten zusammen und geben sie im JSON-Format zurück.
- `rest` enthält den eigentlichen Web-Server, der die Ergebnisse der Script ausliefert.

Start
-----

Die OpenData-Schnittstelle kann mit

    rest/rest.js

gestartet werden. Für weitere Installationshinweise bitte `rest/README.md` lesen.


Fragen
------

Bei Fragen bitte eine Mail an support@piraten-mv.de schreiben. Wir helfen gerne!
