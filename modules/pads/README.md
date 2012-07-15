Piratenpads
===========

Was ist das hier?
-----------------

Dieser Ordner enthält verschiedene Scripte, die Pad-Gruppen des Pad-Servers der Piratenpartei Deutschland abfragen (http://www.piratenpad.de) und das Ergebnis im JSON-Format zurückgeben.

Scripte
-------

- `getPadById.php` gibt ein Pad nach Id und Pad-Gruppe zurück
- `getPadList.php` gibt die Liste aller Pads einer Pad-Gruppe zurück
- `getPads.php` gibt alle Pads eine Pad-Gruppe zurück

Die Scripte sind in PHP geschrieben und enthalten eine Beschreibung über die genauen Parameter.

Voraussetzung
-------------

Um die Scripte zu nutzen, müssen Account-Datein (Gruppenname, Nutzername und Passwort) in die Datei `keys.json` eingetragen werden.

**Achtung:** Die mitgelieferte Datei `keys.json` enthält keine gültigen Nutzerdaten, sondern nur Dummy-Daten.

Die Scripte benötigen den mitgelieferten PHP Simple HTML
DOM Parser (http://sourceforge.net/projects/simplehtmldom/). Der PHP Simple HTML DOM Parser is unter der MIT-Lizenz (http://opensource.org/licenses/MIT) herausgegeben.

Anpassung an andere LQFB-Instanzen
----------------------------------

Momentan sind die Skripte auf sämtliche unter http://www.piratenpad.de gehosteten Pad-Gruppen eingerichtet. Eine Anpassung auf einen anderen Server sollte möglich sein, wurde aber hier nicht angestrebt.

Fragen
------

Bei Fragen bitte eine Mail an support@piraten-mv.de schreiben. Wir helfen gerne!
