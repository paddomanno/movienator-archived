import {DataSource} from "typeorm";


/**
 * The Datasource used to connect to the main Database
 */
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "database",
    port: 3306,
    username: "root",
    password: "root",
    database: "movienator-database",
    //Hier die importierten Entitätsklassen angeben
    entities: [],
    synchronize: true,
    logging: false,
})


