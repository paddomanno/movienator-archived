Jede Entität sollte mindestens die CRUD Operationen erfüllen.

## Externe API
https://developers.themoviedb.org/3/getting-started/introduction

## Status Codes
- `200` The GET request was successful
- `201` The POST or PUT request was successful
- `204` The DELETE request was successful
- `401` Unauthorized request - for example when the user is not logged in
- `404` The requested ressource was not found
- `500` The request failed

## Response Bodies

    data: {single object or object array}

Außer dem data field wird nichts übergeben.  
Bei fehlgeschlagenen Requests (4xx oder 5xx ist der body leer)