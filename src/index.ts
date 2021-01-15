import chalk from 'chalk';
import cluster from 'cluster';
import config from 'config';
import { SetupServer } from './server';

(async (): Promise<void> => {
    if (cluster.isMaster) {
        // Fork workers
        for (let i = 0; i < 1; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(
                `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
            );
            console.log('Iniciando um novo worker');
            cluster.fork();
        });
    } else {
        console.log(chalk.bgGreen.black('\n Iniciando! \n'));
        const server = new SetupServer(config.get('App.port'));
        await server.init();
        server.start();
    }
})();
