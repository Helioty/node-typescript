import { Server } from '@overnightjs/core';
import { Application } from 'express';
import { AppsController } from './controllers/apps';
import { ForecastController } from './controllers/forecast';
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
        this.addControllers([appsController, forecastController]);
    }

    private async setupOracledb(): Promise<void> {
        try {
            console.log('Inicializando database module \n');
            await database.connect().then(() => {
                console.log('Connection pool started \n');
                console.log('Connected to', chalk.yellow(database.dbConfig.host), '\n');
            });
        } catch (err) {
            console.error(err);
            process.exit(1); // Código de falha diferente de zero
        }
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
