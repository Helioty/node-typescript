// import { ConnectionStance } from './index';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import bodyParser from 'body-parser';
import oracledb from 'oracledb';
import './util/module-alias';

export class SetupServer extends Server {
    constructor(private port = 3001) {
        super();
    }

    public init(): void {
        this.setupExpress();
        this.setupOracledb();
        this.setupControllers();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
    }

    private async setupOracledb(): Promise<any> {
        // return await oracledb.createPool().catch(() => {
        //     console.log(`Error on try to connect to database!`);
        //     process.exit();
        // });
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();
        this.addControllers([forecastController]);
    }

    public getApp(): Application {
        return this.app;
    }
}
