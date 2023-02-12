# MOVIENATOR 3000

Dokumentation für die API ist [hier](./movienator_express/routes/Docs/routes.md).

Die beiden docker compose files lassen sich starten über.

    docker-compose -f .\docker-compose-dev.yml up --remove-orphans
    docker-compose -f .\docker-compose-test.yml up --remove-orphans

Evt müsst ihr einmal `--remove-orphans` als option mitgeben.

## Routen-Struktur

Entsprechend der Entitäten unserer Anwendung gibt es folgende Grund-Routen:
'/actor'
'/movie'
'/profileImage'
'/review'
'/user'
'/genre'
'/recommendation'
'/watchProvider'
Zusätzlich werden über '/extern' die externen APIs angesprochen.
Innerhalb der einzelnen Grund-Routen wird grundsätzlich mit GET '/all' auf alle Einträge der abgefragten Entität zugegriffen.
Mit GET '/one/:id' wird auf einen Eintrag mit der angegebenen ID zugegriffen.
Abhängig von der Entität gibt es noch individuelle Routen, welche mit den Entitäten zusammenhängende Daten abfragen. So liefert GET '/user/:id' beispielsweise alle Nutzer zurück, die den per ID angegebenen Film bewertet haben.
POST '/' auf der entsprechenden Grund-Route erstellt jeweils einen neuen Eintrag einer Entität. PUT '/' auf einer Grund-Route updated einen bestehenden Eintrag, indem der passende Eintrag über die im Body angegebene ID ermittelt wird.
DELETE '/:id' auf einer Grund-Route löscht den Eintrag zur angegebenen ID.
