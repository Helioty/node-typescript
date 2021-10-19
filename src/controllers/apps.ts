import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { AppService } from './../services/apps';

@Controller('apps')
export class AppsController {
    private appService = new AppService();
    @Post('new')
    public async create(req: Request, res: Response): Promise<void> {
        const newApp = await this.appService.createApp(req.body);
        res.status(201).send(newApp);
    }
}
