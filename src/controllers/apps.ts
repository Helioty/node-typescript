import { Controller, Post } from '@overnightjs/core';
import { AppService } from './../services/apps';
import { Request, Response } from 'express';

@Controller('apps')
export class AppsController {
    @Post('new')
    public async create(req: Request, res: Response): Promise<void> {
        const appService = new AppService();
        const newApp = await appService.createApp(req.body);
        res.status(201).send(newApp);
    }
}
