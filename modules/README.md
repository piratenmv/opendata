Daten-Module
============

Was ist das hier?
-----------------

Dieser Ordner enthält die Scripte, die vom Webserver mit entsprechenden Parametern ausgeführt werden. Sie stellen die Daten zusammen und geben sie im JSON-Format zurück.


Module
------

- `lqfb`: Scripte, um Informationen aus Liquid Feedback auszugeben
- `members`: Script um die Mitgliederzahlen auszugeben


Einbinden in den Webserver
--------------------------

Die Scripte in den einzelnen Unterverzeichnissen können völlig unabhängig vom Webserver genutzt werden. Damit die Scripte vom Webserver gerufen werden können, muss zu jedem Module eine Nodejs-Datei angegeben werden (z.B. `members.js` für die Scripte im Verzeichnis `members`). Diese Dateien werden beim Start des Webservers eingelesen.


Anpassen
--------

Um eine neue Datenquelle einzubinden, muss wie folgt vorgegangen werden:

1. Script in ein neues Unterverzeichnis von `modules` legen, z.B. `modules/foo/getFoo.py`.

2. Eine Datei für den Webserver anlegen, z.B. `modules/foo.js`. **Achtung:** Die Datei muss die Endung `.js` haben, sonst wird sie vom Webserver nicht eingebunden. In der Datei wird der Webserver `app` angepasst. Ein Beispiel sieht wie folgt aus:

    app.get('/foo/:id', function(req, res) {
      var options = [req.params.id];
      var tool = "foo/getFoo.py";
      care(tool, options, req, res);
    });

3. Webserver neu starten.


Fragen
------

Bei Fragen bitte eine Mail an support@piraten-mv.de schreiben. Wir helfen gerne!
