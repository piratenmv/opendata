Liquid Feedback
===============

Was ist das hier?
-----------------

Dieser Ordner enthält verschiedene Scripte, die Liquid Feedback-Instanzen der Piratenpartei Deutschland abfragen und das Ergebnis im JSON-Format zurückgeben.

Scripte
-------

- `getAreas.py` gibt die Bereiche einer Instanz zurück
- `getByArea.py` gibt alle Initiativen eines Bereiches zurück
- `getById.py` gibt eine Initiativ anhand ihrer Id zurück
- `getByState.py` gibt alle Initiativen mit einem bestimmten Status zurück
- `getSuggestions.py` gibt alle Anregungen zu einer Initiative zurück

Die Scripte sind in Python geschrieben und enthalten eine Beschreibung über die genauen Parameter.

Voraussetzung
-------------

Um die Scripte zu nutzen, sind API-Keys der jeweiligen LQFB-Instanzen erforderlich, die in der Datei `keys.json` eingetragen werden müssen. Einen API-Key kann jeder Nutzer mit einem Zugang zur jeweiligen LQFB-Instanz erzeugen. In der Bundesinstanz geht dies über https://lqfb.piratenpartei.de/pp/member/developer_settings.html. In den Landesinstanzen (z.B. in Mecklenburg-Vorpommern) geht das über https://lqpp.de/mv/member/developer_settings.html. Der Key muss dann in der Datei `keys.json` für die entsprechende Instanz eingetragen werden.

**Achtung:** Die mitgelieferte Datei `keys.json` enthält keine API-Keys, sondern nur die oben genannten Verweise.

Anpassung an andere LQFB-Instanzen
----------------------------------

Momentan sind die Bundesinstanz (https://lqfb.piratenpartei.de) und die in Berlin gehosteten Länderinstanzen (https://lqpp.de) unterstützt. Um eine andere Instanz zu unterstützen, muss in den Scripten die Erzeugung der URLs angepasst werden. Außerdem wird sich momentan auf die URL-Shortener unter http://pplf.de verlassen.

Fragen
------

Bei Fragen bitte eine Mail an support@piraten-mv.de schreiben. Wir helfen gerne!
