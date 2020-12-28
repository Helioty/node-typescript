import { Server } from '@overnightjs/core';
import { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import bodyParser from 'body-parser';
import './util/module-alias';

export class SetupServer extends Server {
    constructor(private port = 3001) {
        super();
    }

    public init(): void {
        this.setupExpress();
        this.setupControllers();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();
        this.addControllers([forecastController]);
    }

    public getApp(): Application {
        return this.app;
    }
}
