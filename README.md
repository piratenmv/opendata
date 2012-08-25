OpenData-Schnittstelle
======================

Was ist das hier?
-----------------

An dieser Stelle soll nach und nach die OpenData-Schnittstelle des Landesverbandes Mecklenburg-Vorpommern der Piratenpartei Deutschland veröffentlicht werden. Eine erste Version ist unter http://opendata.piratenpartei-mv.de erreichbar (sehr unvollständig dokumentiert). Ein erstes Frontend, das die Daten nutzt gibt es unter http://dashboard.piratenpartei-mv.de.

Das Ziel ist es, sämtlich Informationen des Landesverband maschinenlesbar anzubieten, sodass sie unabhängig vom konkreten System (LQFB, Redmine, Piratenpad, Wiki, Webseite, ...) angezeigt und aufbereitet werden können.

Aufbau
------

Letztendlich werden die Daten über eine REST-API im JSON- oder XML-Format ausgegeben. Dazu nutzen wir Node.js (http://nodejs.org) mit dem Express Framework (http://expressjs.com).

- `modules` enthält die Scripte, die vom Webserver mit entsprechenden Parametern ausgeführt werden. Sie stellen die Daten zusammen und geben sie im JSON- oder XML-Format zurück.
- `rest` enthält den eigentlichen Web-Server, der die Ergebnisse der Script ausliefert.

Start
-----

Die OpenData-Schnittstelle kann mit

    rest/rest.js

gestartet werden. Anschließend stehen die Datenquellen aus dem Ordner `modules` zur Verfügung. Beispielsweise kann unter der URL http://localhost:3333/members/mv die Mitgliederzahlen des Landesverbandes Mecklenburg-Vorpommern angezeigt werden:

    $ curl http://localhost:3333/members/mv
    
    {
        "einwohner": 1600000, 
        "flaeche": 23180, 
        "mitglieder": 484, 
        "mitglieder_je_einwohner": 295, 
        "mitglieder_je_flaeche": 21, 
        "stand": "04.08.2012", 
        "stimmberechtigt": 269
    }

Es gibt auch eine XML-Ausgabe:

    $ curl http://localhost:3333/members/mv.xml
    
    <?xml version="1.0" encoding="utf-8"?>
    <root>
        <mitglieder>484</mitglieder>
        <stimmberechtigt>269</stimmberechtigt>
        <einwohner>1600000</einwohner>
        <mitglieder_je_einwohner>295</mitglieder_je_einwohner>
        <flaeche>23180</flaeche>
        <mitglieder_je_flaeche>21</mitglieder_je_flaeche>
        <stand>04.08.2012</stand>
    </root>

Für weitere Installationshinweise bitte `rest/README.md` lesen. Eine Übersicht über die existierenden Datenquellen gibt es in `modules/README.md`.


Fragen
------

Bei Fragen bitte eine Mail an support@piraten-mv.de schreiben. Wir helfen gerne!
