import { Server } from '@overnightjs/core';
import { Application } from 'express';
import { AppsController } from './controllers/apps';
import { AquilaController } from './controllers/aquila';
import { ForecastController } from './controllers/forecast';
import swaggerUi from 'swagger-ui-express';
import apiSchema from './api-schema.json';
import swaggerjsdoc from 'swagger-jsdoc';
import * as database from './database';
import bodyParser from 'body-parser';
import './util/module-alias';
import chalk from 'chalk';
import cors from 'cors';

export class SetupServer extends Server {
    constructor(private port = 8080) {
        super();
    }

    public async init(): Promise<void> {
        this.setupExpress();
        await this.docsSetup();
        this.setupControllers();
        await this.setupOracledb();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();
        const appsController = new AppsController();
        const aquilaController = new AquilaController();
        this.addControllers([
            appsController,
            aquilaController,
            forecastController,
        ]);
    }

    private async setupOracledb(): Promise<void> {
        try {
            console.log('Inicializando database module \n');
            await database.connect().then(() => {
                console.log('Connection pool started \n');
                console.log(
                    'Connected to',
                    chalk.yellow(database.dbConfig.host),
                    '\n'
                );
            });
        } catch (err) {
            console.error(err);
            process.exit(1); // Código de falha diferente de zero
        }
    }

    private async docsSetup(): Promise<void> {
        const options = {
            swaggerDefinition: apiSchema,
            // Paths to files containing OpenAPI definitions
            apis: ['**/controllers/**.ts'],
        };

        const swaggerSpec = swaggerjsdoc(options);
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log('Server listening on port:', this.port);
        });
    }

    public async close(): Promise<void> {
        await database.close();
    }

    public getApp(): Application {
        return this.app;
    }
}
