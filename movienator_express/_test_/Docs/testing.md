## Aufbau unserer Tests

Es gibt eine Testfile für jede der Routen und damit auch für jede der Entitäten. Innerhalb der Testfiles wird die Test-Datenbank genutzt. Also kann man ganz normal Objekte mit `.save()` speichern und dan über Supertest Anfragen an die App schicken.

Nach jeder Test Suite (also nach jeder Testfile), wird die Datenbank automatisch komplett zurückgesetzt. Man kann also am Anfang jeder Suite
von einer komplett leeren Datenbank ausgeben.

## Wichtig beim Schreiben von Tests

Die einzelnen Suites sollten wenn möglich nur die Endpoints einer einzelnen Routen benutzen - also `actor.test.ts` sollte nur auf die Endpoints `/actor/*` zugreifen.
Der Sinn ist, dass die Unit-Tests die Endpoints unabhängig voneinander testen sollen. Wenn wir später das Verhalten von Routen ändern sind nur die Tests betroffen, die diese Routen auch wirklich testen. Wenn man für einen Test zusätzliche Daten in der Datenbank braucht (zb. um zu prüfen, ob Relationen richtig behandelt werden)
ist es sowieso einfacher, die Objekte vor dem Test zu initialisieren und dann mit `.save()` zu speichern.
