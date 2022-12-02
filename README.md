# FWE Hausaufgabe 1 Kevin Hasse

## Project Setup
The project is run through docker containers and can therefore be started with a simple docker command.

    docker compose up

This will start up 4 Docker Images
1. `fwe-express-server`
2. `fwe-database`
3. `fwe-phpadmin`
4. `fwe-react`

**Notice:** When starting the containers for the very first time, the databases initial boot might still be
going on while the Express Server already tries to establish a connection. As a result the exprress-server will 
fail to boot. In that case, just stop the containers with CTRL+C and start them up again.
This time the databases won't have to go through the inital boot process and the connection will work.

### The Express Server
The Express server is obviously our webserver that manages the API. 
The [package.json](./fwe_express/package.json) defines to scripts that can be used to either start the server normally or run the defined tests.
The desired mode needs to be changed in the last line of the [Dockerfile](./fwe_express/Dockerfile) by changing the third parameter to either "test"(for testing) or "debug" (to run)  
**Notice:** These changes will not be taken into account by simply calling the docker up command.  
So instead of:
    
    docker compose up

You will have to call:
    
    docker compose up --build

I am using the tsc-watch module to enable hot-reloading. This watches all the .ts files for changes and recompiles them if needed.  
**Notice:** Changes need to actually be saved to trigger the reload (strg+s in most cases)

### The Databases
The Databases are a mySQL database servers. The created main database is called fwe-database.
The test database is called fwe-database-test.  

The PhpAdmin in a web application to manage the database and view its current state.
- Adress: [localhost:8081](http://localhost:8081)
- User: root
- Password: root

The test database can not be accessed through phpAdmin but there is nothing to see there anyway since
the Data is destroyed after every test suite anyway.

### The React Server
This is the program's frontend. The home page can be accessed at [localhost:3000](http://localhost:3030).
A detailed description of the frontend will be given below.  

The React App also uses hot-reloading through `WATCHPACK_POLLING=true` so after saving changes to the files,
the ts files will be recompiled and the changes applied.

## Testing

### Test Setup
I am using jest and supertest to automatically test my API. The test files along with some utility files to manage the tests
are in the [\_test_](./fwe_express/_test_) folder. There are test suites for each of the API routes. 
Each file is testing all the CRUD commands for this route as well as special use cases like
- Finding recipe by name
- Finding all recipes with specified ingredient
- Getting all recipes

Since the tests are all using the same database connection, they are run with the `-runInBand` option
to not mess with each other. Each test suite resets the database before its tests are run.

### Running the Tests
To run the tests you need to make sure, that the CMD line in the Dockerfile is correct:

    CMD [ "npm", "run", "test" ]

Since you cannot fully determine in what order the tests suites will be executed **and** you can't pass
parameters into them, I wasn't able to create a single Database Connection that all tests use.
Because of this, each test suite will attempt to open its own connection which the database will reject, 
leading to Jest not shutting down correctly and displaying the message: 

> Jest did not exit one second after the test run has completed.
> 
> This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.

Since it doesn't seem to affect the effectiveness of the tests in any way, I accepted this and moved on.

Note: You may notice, that the amount of tests might be doublet if they are run after the normal 
project has been run before. This happens because my docker configuration maps the .dist folder
(The Destination Folder of the Typescript Compiler) back to the projects file structure.  

Jest will then recognize the compiled test files and run tests from both them and their corresponding
Typescript files. Both will finish successfully so, again, I don't have enough reason to try to change this.

## The API
There are 3 main routes my API is using.
- `/step` - Used to manage the Step entity
- `/ingredient` - Used to manage the Ingredient entity
- `/recipe` - Used to manage the recipe entity, as well as its relations to the other two

There is also a 4th route "/custom" which is not a part of the API but just used my me for testing and debug

All routes respond with json structs that follow the same schema:

    success: true/false
    reply: eg. "The recipe was found" or "No Step with ID 5"
    step: The object that was created / updated / requested

If a single Object was requested.

    success: true/false
    reply: eg. "The recipe was found" or "No Step with ID 5"
    allSteps: The objects that where requested

If multiple objects where requested

### Codes
All API calls can respond with 3 different status codes:
- `200` if the requested operation was successful
- `404` if one of the specifies objects wasn't found in the database
- `500` if an error occurred

### /step
Provides routes to perform CRUD operations on the step entity
- `GET /one/:id` to return a single step
- `GET /all` to return all steps
- `POST /` to create a step sent in the http body
- `PUT /:id` to update a specified step with values sent in the body. ID can not be updated
- `DELETE /:id` to delete a specified step

### /ingredient
Provides routes to perform CRUD operations on the ingredient entity
- `GET /one/:id` to return a single ingredient
- `GET /all` to return all ingredients
- `POST /` to create an ingredient sent in the http body
- `PUT /:id` to update a specified ingredient with values sent in the body. ID can not be updated
- `DELETE /:id` to delete a specified ingredient

### /recipe
Provides routes to perform CRUD operations on the recipe entity as well as manage its 
relations to the other entities
- `GET /one/:id` to return a single recipe
- `GET /all` to return all recipes
- `GET /all/ingredient/:ingredientId` to return all recipes that contain a specified ingredient
- `GET /all/name/:recipeName` to return all recipes that fit the given name
- `POST /` to create a recipe sent in the http body
- `POST /:recipeId/contains/:ingredientId` to add a recipe-ingredient relation with values sent in the http body
- `POST /:recipeId/step/:stepId` to add a recipe-step relation
- `PUT /:id` to update a specified recipe with values sent in the body. ID can not be updated. 
Relations to others can not be updated here. There are special routes for that.
- `PUT /:recipeId/contains/:ingredientId` To update a recipe-ingredient relation with values sent in the http body
- `DELETE /:id` to delete a specified step
- `DELETE /:recipeId/contains/:ingredientId` To delete a recipe-ingredient relation
- `DELETE /:recipeId/step/:stepId` To delete a recipe-step relation

## Own Feature 1 [See](./fwe_express/entity/recipe.ts)
To implement my first Feature, I used the API provided by [CalorieNinjas](https://calorieninjas.com/api).
It provides a service to get nutrition information for all common ingredients. A free Account lets you 
send 10000 requests per month, which should be more than enough in my case.

Whenever an ingredient is added to a recipe, a single request is compiled, containing all the ingredients of that recipe,
and sent to the API. The same is done if an ingredient is deleted, or the amount in a recipe is edited. An API call
may look like this:

    100 g tomato and 30 g sugar and

The returned data is parsed and relevant information used and stored in the database.

In addition to that, I am also using a **very** basic calculation to assign each recipe a nutritional score from A through F.
The process is very simple and not very realistic but it is only supposed to show the possibility of a more accurate rating.

## Own Feature 2 [See](./fwe_express/routes/ingredient.ts)
Just for fun I added another feature. Whenever a new ingredient is created, its name is send to an API provided by 
[Pexels](https://www.pexels.com/de-de/), a stock photo service. The Api returns a lot of information, 
among which is a link to a picture, fitting that word. That link is saved to the database and embedded when showing
the ingredient, to show a picture along with it.

**Note**: The pictures returned by the API are a bit hit-or-miss. I've gotten some weird ones before.


## Error Handling
### Not all Fields sent
Irrelevant for DELETE and GET since no bodies are sent. 
PUT only updated the fields that are received.
POST will cause an exception, which will be caught and produce a 500 error code.

### Empty fields sent
Irrelevant for DELETE and GET since no bodies are sent.
PUT handles empty fields just like ones that wherent sent
POST again produces an 500 error code.

### Incorrect, Script, HTML
Incorrect values, eg. wrong Datatypes that cant be casted, will produce a 500 error code. 
HTML Code and Scripts are not executed but are shown als plain text on the frontend.

## Frontend
The Frontend provides functionality to view recipes, ingredients as well as their relations. There are also button to
add new entries, edit the existing ones, or delete them. Recipes can be searched by their names. The detail view
for each ingredient shows the recipes it is used in.

### Routing
The routes are managed by a `react-router-dom` Router. If a non existing Route is called, 
an Error page is shown with a link to the homepage. If a route to a detail view of a non existing recipe or ingredient is called,
the user will be forwarded to the recipe / ingredient overview instead.

### Error Handling
All field have the required attribute set to true, so no fields should be missing or empty.
Script and HTML will not be processed, but just shown as plain text.