# MOVIENATOR 3000

Gliederung:

- Projektidee
- Starten der Anwendung
- Techstack
- Datenstruktur
- Angebundene APIs
- Testing
- Funktionalitäten
- API Dokumentation


## Projektidee
Ziel des Projektes war es, eine Platform zu entwickeln, auf der Nutzer neue Filme entdecken und bereits gesehene Filme bewerten können. Außerdem sollen verschiedene soziale Features
vorhanden sein, wie das Suchen und Hinzufügen von anderen Nutzern als Freunde, das Lesen von Reviews dieser Freunde und das Senden von Filmempfehlungen an einzelne Freunde. Zudem 
soll es einen Weg geben einen anstehenden Filmabend mit seinen Freunden zu planen und Filmempfehlungen für genau diese Gruppe an Freunden zu bekommen.

## Starten der Anwendung

Die Anwendung lässt sich jeweils in verschiedenen Modi über eine einzelne Docker-Compose Datei starten.

- `DEV` zur lokalen Entwicklung. Es wird eine lokale Datenbank erstellt und beim ersten Starten mit Beispieldaten befüllt. 
- `PROD` zum gemeinsamen Nutzen. Es wird eine online gehostete Datenbank genutzt.
- `TEST` um Frontend und Backend Tests laufen zu lassen. Mehr dazu im Abschnitt 'Testing'

Die Befehle um die entsprechenden Compose Files zu starten sind:

    docker-compose -f .\docker-compose-dev.yml up
    docker-compose -f .\docker-compose-prod.yml up
    docker-compose -f .\docker-compose-test.yml up

**Achtung:** Beim erstmaligen Starten der `dev` Umgebung braucht die Datenbank meist etwas länger um initialisiert zu werden, wodurch das Backend keine Verbindung zu der Datenbank
herstellen kann und abstürzt. In dem Fall müssen die Container einfach einmal neu gestartet werden.

Nach dem Starten ist die Homepage der Anwendung unter [http:/localhost:3000/home](http:/localhost:3000/home) erreichbar.

## Techstack
### Datenbank
- Unser DBMS ist [MySQL](https://www.mysql.com/de/) 
- Es wird entweder eine lokale Datenbank benutzt oder eine von [Free Sql Database](https://www.freesqldatabase.com/) gehostete
### Backend
- Wir benutzen ein [Node.js](https://nodejs.org/en/) Backend mit dem [Express](https://expressjs.com/de/) Web-Framework
- Die Datenbankanbindung läuft über [TypeORM](https://typeorm.io/)
- Für zusätzliche Typsicherheit benutzen wir [Typescript](https://www.typescriptlang.org/)
### Frontend
- Für unser Frontend benutzen wir [React](https://reactjs.org/)
- Für das Design des Frontends wird [MUI](https://mui.com/) eingesetzt
- Auch hier benutzen wird durchgehend [Typescript](https://www.typescriptlang.org/) für saubereren und sichereren Code
### Testing
 - Um unser Backend zu Testen benutzen wir Jest und Supertest
 - Um die Antworten der externen APIs zu Testen benutzen wir Nock
 - In unseren Frontendtests setzen wir die [Jest-Dom testing library](https://testing-library.com/docs/ecosystem-jest-dom/) zusammen mit der [React testing library](https://testing-library.com/docs/react-testing-library/intro/) ein

## Datenstruktur
Die finale, von unserer Datenbank verwaltete Datenstruktur ist in diesem UML-Diagramm dagestellt.
![UML-Diagramm](.\db-schema-11-2-23.PNG)

## Angebundene Externe APIs
In unserer Anwendung werden zwei externe APIs benutzt.
1. [The Movie Database API](https://developers.themoviedb.org/3/getting-started/introduction)

Von dieser API beziehen wir alle Film und Schauspielerdaten, die wir in unserer Anwendung verwendet. Sie bietet eine Menge an Routen um verschiedene Daten zu Filmen abzufragen,
die wir dann so aufbereiten und zusammenstellen, dass wir sie in Form unserer Entitäten speichern können. Mit einem kostenlosen Account ist diese API vollständig kostenlos und
ohne Request-Limit nutzbar.
2. [PurgoMalum](https://rapidapi.com/de/community/api/purgomalum-1)

Diese Api empfängt einen Text und analysiert ob diese Schimpfwörter oder andere Obszönitäten enthält. Wir benutzen diese um Hatespeech und Beleidigungen in Reviews oder Empfehlungen auf unserer Website zu vermeiden.
Mit einem kostenlosen Konto ist auch diese API ohne Einschränkungen nutzbar.

## Testing
Der Testing-Techstack ist oben schon beschrieben. Im Backend ist jede Route ausführlich und auf jeden eventuellen Fehler getestet. Im Frontend haben wir uns aus Zeitgründen auf eine handvoll repräsentativer Tests beschränkt,
die demonstrieren, auf welchem Weg ein React Frontend getestet werden kann.

### Gitlab CI-Pipeline
Um die Tests automatisiert ausführen zu lassen, haben wir uns eine Gitlab Pipeline aufgesetzt, die bei jedem Push in unser Repository 4 test suites durchläuft.

- `backend-tests`
- `backend-linter`
- `frontend-tests`
- `frontend-linter`

So können wir sicherstellen, dass der Code in unserem Repository zu jedem Zeitpunkt lauffähig ist und gleichzeitig auch unseren Qualitätsansprüchen genügt, die wir in unseren `.eslintrc.json` Dateien festgelegt haben.

## Funktionalitäten
Um die wichtigsten Funktionalitäten unserer Anwendung zu präsentieren, haben wir einige Videos aufgenommen.

## API-Dokumentation
