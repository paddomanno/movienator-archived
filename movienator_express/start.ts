import app from './app';
import { AppDataSource } from './data-source';

const PORT = 8080;
const HOST = '0.0.0.0';

/**
 * Separate file to start the actual App so that tests can use the ./app without the server starting on port 8080
 */

AppDataSource.initialize()
  .then(async () => {
    console.log('Express app - Database connection established');
  })
  .catch((error) => console.log(error));

app.listen(PORT, HOST, () => {
  console.log(`Express app running on http://${HOST}:${PORT}`);
});
