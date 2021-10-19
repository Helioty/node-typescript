import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { AquilaService } from './../services/aquila';

@Controller('aquila')
export class AquilaController {
    private aquilaService = new AquilaService();

    @Get('infoPessoal/:matricula')
    public async getInfoPessoal(req: Request, res: Response) {
        console.log(
            `\nGet informação pessoal da matricula: ${req.params.matricula}`
        );
        await this.aquilaService
            .getInfoPessoal(Number(req.params.matricula))
            .then(
                (retorno) => {
                    res.status(200).send(retorno);
                },
                (error) => {
                    res.status(error.status).send({
                        error: error.error,
                        status: error.status,
                        message: error.message,
                    });
                }
            );
    }

    @Get('indicadoresDesempenho/:matricula')
    public async getIndicadoresDesempenho(req: Request, res: Response) {
        console.log(
            `\nGet indicadores de desempenho da matricula: ${req.params.matricula}`
        );
        await this.aquilaService
            .getIndicadoresDesempenho(Number(req.params.matricula))
            .then(
                (retorno) => {
                    res.status(200).send(retorno);
                },
                (error) => {
                    res.status(error.code).send({
                        title: error.title,
                        message: error.message,
                    });
                }
            );
    }

    @Get('projetos')
    public async getProjetos(_: Request, res: Response) {
        console.log(`\nGet projetos ferreira costa.`);
        await this.aquilaService.getProjetos().then(
            (retorno) => {
                res.status(200).send(retorno);
            },
            (error) => {
                res.status(error.code).send({
                    title: error.title,
                    message: error.message,
                });
            }
        );
    }
}
